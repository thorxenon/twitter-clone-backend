import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'follows' })
export class Follow{
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'follower' })
    @ManyToOne(() => User, (user) => user.slug, { onDelete: 'CASCADE' })
    follower: Relation<User>;

    @Column({ name: 'follower' })
    follower_slug: string;

    @JoinColumn({ name: 'following' })
    @ManyToOne(() => User, (user) => user.slug, { onDelete: 'CASCADE' })
    following: Relation<User>;

    @Column({ name: 'following' })
    following_slug: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}