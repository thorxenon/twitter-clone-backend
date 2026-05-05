import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './database.seeder';
import { RolesSeeder } from './role.seeder';
import { PermissionSeeder } from './permission.seeder';
import { User } from './../users/entities/user.entity';
import { Role } from './../auth/entities/role.entity';
import { Permission } from './../auth/entities/permission.entity';
import { RoleHasPermission } from './../auth/entities/roleHasPermission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, RoleHasPermission])],
  providers: [DatabaseSeeder, RolesSeeder, PermissionSeeder],
  exports: [DatabaseSeeder, RolesSeeder, PermissionSeeder],
})
export class DatabaseModule {}
