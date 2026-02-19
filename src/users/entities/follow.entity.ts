import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'follows' })
export class Follow{
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'follower' })
    @ManyToOne(() => User, (user) => user.slug, { onDelete: 'CASCADE' })
    follower: User;

    @Column({ name: 'follower' })
    follower_id: string;

    @JoinColumn({ name: 'following' })
    @ManyToOne(() => User, (user) => user.slug, { onDelete: 'CASCADE' })
    following: User;

    @Column({ name: 'following' })
    following_id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}