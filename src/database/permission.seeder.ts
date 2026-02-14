import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/auth/entities/permission.entity";
import { Repository } from "typeorm";

@Injectable()
export class PermissionSeeder{
    constructor(
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>
    ){}

    async seed(): Promise<Permission[]>{
        const permissions = [
            'users',
            'roles',
            'tweets',
            'likes',
        ];

        const toCreate: Partial<Permission>[] = [];

        for(const permission of permissions){
            toCreate.push(
                { name: `${permission}-create` },
                { name: `${permission}-list` },
                { name: `${permission}-show` },
                { name: `${permission}-update` },
                { name: `${permission}-delete` }
            );
        }

        const createdPermissions = this.permissionsRepository.create(toCreate);
        const savedPermissions = await this.permissionsRepository.save(createdPermissions);

        console.log('Permissions seeded successfully');
        return savedPermissions;
    }
}