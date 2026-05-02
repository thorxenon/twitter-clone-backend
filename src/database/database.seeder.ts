import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./../auth/entities/role.entity";
import { User } from "./../users/entities/user.entity";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class DatabaseSeeder{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}

    async seed(){
        try{
            console.log("Seeding database...");
            const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
            const defaultRole = await this.roleRepository.findOne({ where: { name: 'default' } });

            if (!adminRole || !defaultRole) {
                throw new Error("Role not found. Please seed roles first.");
            }

            const newUserAdmin = this.userRepository.create({
                slug: process.env.ADMIN_NICKNAME as string,
                name: process.env.ADMIN_FULL_NAME as string,
                email: process.env.ADMIN_EMAIL as string,
                role_id: adminRole.id,
                password: process.env.ADMIN_PASSWORD as string,
                birth_date: new Date(process.env.ADMIN_BIRTH_DATE as string)
            });

            const defaultUserAdmin = this.userRepository.create({
                slug: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                role_id: defaultRole.id,
                password: '12345678',
                birth_date: new Date('1990-01-01')
            });

            await this.userRepository.save(newUserAdmin);
            await this.userRepository.save(defaultUserAdmin);
            console.log("Database seeded successfully.");
        }catch(error: any){
            console.error("Error seeding database:", error);
            throw new Error("Error seeding database", error);
        }
    }
}