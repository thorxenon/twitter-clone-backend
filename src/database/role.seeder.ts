import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./../auth/entities/permission.entity";
import { RoleHasPermission } from "./../auth/entities/roleHasPermission.entity";
import { Role } from "./../auth/entities/role.entity";
import { User } from "./../users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesSeeder{
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(RoleHasPermission)
        private readonly roleHasPermissionRepository: Repository<RoleHasPermission>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ){}

    async seed(): Promise<void>{
        const role = new Role();
        role.name = 'admin';

        const defaultRole = new Role();
        defaultRole.name = 'default';

        const allPermissions = await this.permissionRepository.find();

        await this.roleRepository.save(role);
        await this.roleRepository.save(defaultRole);
        const rolePermissions: RoleHasPermission[] = [];
        const userRolePermissions: RoleHasPermission[] = [];

        for(const permission of allPermissions){
            const rolePermission = new RoleHasPermission();
            rolePermission.role = role;
            rolePermission.permission = permission;
            rolePermissions.push(rolePermission);
            const defaultRolePermission = new RoleHasPermission();
            defaultRolePermission.role = defaultRole;
            defaultRolePermission.permission = permission;
            userRolePermissions.push(defaultRolePermission);
        }

        const createUserRolePermissions = this.roleHasPermissionRepository.create(userRolePermissions);
        const createdRolePermissions = this.roleHasPermissionRepository.create(rolePermissions);
        await this.roleHasPermissionRepository.save(createdRolePermissions);
        await this.roleHasPermissionRepository.save(createUserRolePermissions);
        
        console.log('Roles seeded successfully');
    }
}