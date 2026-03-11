import { Role } from "../../auth/entities/role.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";
import * as argon2 from "argon2";
import { Tweet } from "../../tweets/entities/tweet.entity";
import { Like } from "../../likes/entities/like.entity";
import { Follow } from "./follow.entity";
// import dotenv from 'dotenv';
// dotenv.config();

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @OneToMany(() => Tweet, (tweet) => tweet.user)
    tweets: Relation<Tweet[]>;

    @Column({ type: 'varchar', length: 255, default: '/uploads/user-avatar/default.png' })
    avatar: string;

    @Column({ type: 'varchar', length: 255, default: '/uploads/user-cover/cover.jpg' })
    cover: string;

    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role' })
    role: Relation<Role>;

    @OneToMany(() => Follow, (follow) => follow.follower)
    followers: Relation<Follow[]>;

    @OneToMany(() => Follow, (follow) => follow.following)
    following: Relation<Follow[]>;

    @Column({ name: 'role' })
    role_id: number;

    @OneToMany(() => Like, (like) => like.user)
    likes: Relation<Like[]>;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'date' })
    birth_date: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @BeforeInsert()
    private async generateHash(){
        try{
            const hash = await argon2.hash(this.password + process.env.PEPPER ,{
                type: argon2.argon2id,
                memoryCost: 2 ** 16, // 64 MB
                timeCost: 5,
                parallelism: 4,
            });
            this.password = hash;
        }catch(error){
            throw error;
        }
    }

    async verifyPassword(password: string){
        return await argon2.verify(this.password, password + process.env.PEPPER);
    }
}