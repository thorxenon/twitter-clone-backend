import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleHasPermission } from "./roleHasPermission.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @OneToMany(() => RoleHasPermission, (roleHasPermission) => roleHasPermission.role)
    roleHasPermissions: RoleHasPermission[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
