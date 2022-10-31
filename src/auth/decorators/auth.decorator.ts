import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

import { validRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';


export const Auth = (...roles: validRoles[]) => {
    return applyDecorators(
    RoleProtected( validRoles.superUser, validRoles.admin),
    UseGuards(AuthGuard, UserRoleGuard),
  );
}