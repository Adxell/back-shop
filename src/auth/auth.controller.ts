import { Controller, Get, Post, Body, UseGuards, Req, Headers} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto,  LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces/valid-roles';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ status: 201, description: 'User was created'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiCreatedResponse({ status: 200, description: 'User logged'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @ApiCreatedResponse({ status: 200, description: 'status ok for JWT'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @RoleProtected()
  @UseGuards( AuthGuard(), UserRoleGuard )
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }

  // @Get('private')
  // @UseGuards( AuthGuard() )
  // testingPrivateRoute(
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: User,
  //   @Req() request: Express.Request,
  //   @RawHeaders() rawHeaders: string[],
  //   @Headers() headers: IncomingHttpHeaders
  // ){
  //   // console.log( {user: request.user } )
  //   console.log(request)
  //   return {
  //     ok: true,
  //     message: user,
  //     userEmail,
  //     rawHeaders,
  //     headers
  //   }
  // }

  // // @SetMetadata('roles', ['admin', 'super-user'])

  // @Get('private2')
  // @RoleProtected( validRoles.superUser, validRoles.admin)
  // @UseGuards( AuthGuard(), UserRoleGuard )
  // privateRoute2(
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     user
  //   }
  // }
  // @Get('private3')
  // // @Auth()
  // @RoleProtected( validRoles.superUser, validRoles.admin)
  // @UseGuards( AuthGuard(), UserRoleGuard )
  // privateRoute3(
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     user
  //   }
  // }
}
