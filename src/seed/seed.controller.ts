import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger'

import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';
import { validRoles } from '../auth/interfaces/valid-roles';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  
  @Get()
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  executeSeed ( ) {
    return this.seedService.runSeed()
  }
}
