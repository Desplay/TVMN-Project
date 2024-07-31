import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiResponses } from './httpExceptions.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from './role.decorator';
import { UserRole } from 'src/user/enum/userRole.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

export const PublicAPIDescription = (options) => {
  return applyDecorators(
    ApiResponses(options.summary, options.descriptions),
  );
};

export const AdminAPIDescription = (options) => {
  return applyDecorators(
    Roles([UserRole.ADMIN]),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiResponses(options.summary, options.descriptions),
  );
};

export const UserAPIDescription = (options) => {
  return applyDecorators(
    Roles([UserRole.USER]),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiResponses(options.summary, options.descriptions),
  );
};

export const AdminAndUserAPIDescription = (options) => {
  return applyDecorators(
    Roles([UserRole.ADMIN, UserRole.USER]),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiResponses(options.summary, options.descriptions),
  );
};
