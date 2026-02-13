import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { Role } from "./role.entity";

@Entity({ name: 'roles_permissions' })
export class RoleHasPermission{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'role' })
    roleId: number;

    @JoinColumn({ name: 'role' })
    @ManyToOne(() => Role, (role) => role.id, { nullable: false })
    role: Role;

    @Column({ name: 'permission' })
    permissionId: number;

    @JoinColumn({ name: 'permission' })
    @ManyToOne(() => Permission, (permission) => permission.id, { nullable: false})
    permission: Permission;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}