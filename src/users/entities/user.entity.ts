import { Role } from "src/auth/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    nickname: string;

    @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, default: '/uploads/user/images/default.png' })
    avatar: string;

    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role' })
    role: Role;

    @Column({ name: 'role' })
    roleId: number;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link: string;

    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Column({ type: 'date' })
    birth_date: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}