import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleHasPermission } from "./roleHasPermission.entity";

@Entity({ name: 'permissions' })
export class Permission{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @OneToMany(() => RoleHasPermission, (roleHasPermission) => roleHasPermission.permission)
    roleHasPermissions: RoleHasPermission[];
}