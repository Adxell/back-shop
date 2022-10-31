import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepocitory: Repository<User>, 
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      
      const {password, ...userData} = createUserDto;
      const user = this.userRepocitory.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepocitory.save( user )
      delete user.password
      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }

      //TODO: retornar JWT
    } catch (error) {
      this.handleDBErros(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepocitory.findOne({
        where: {email}, 
        select: {email: true, password: true, id: true}
      })

      console.log(user)

      if ( !user ) {
        throw new UnauthorizedException('Credentials are not valid(email)')
      }
      
      if ( !bcrypt.compareSync( password, user.password) ){
        throw new UnauthorizedException('Credentials are not valid (password)')
      }
      return {
        email: user.email, 
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDBErros(error)
    }
  }

  async checkAuthStatus(user: User){
    return {
      ...user, 
      token: this.getJwtToken({ id: user.id })
    }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token 
  }
  private handleDBErros(error: any): never {
    if ( error.code === '23505' ) {
      throw new BadRequestException(error.detail)
    }

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }

  
}
