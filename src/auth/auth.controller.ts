import { AuthService } from './auth.service';
import { Controller, Get, Post, Body, UseGuards, Req, Headers} from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { CreateUserDto,  LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport'
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces/valid-roles';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @RoleProtected()
  @UseGuards( AuthGuard(), UserRoleGuard )
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @Req() request: Express.Request,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ){
    // console.log( {user: request.user } )
    console.log(request)
    return {
      ok: true,
      message: user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }
  @Get('private3')
  // @Auth()
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }
}
