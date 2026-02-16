import { Role } from "src/auth/entities/role.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Tweet } from "src/tweets/entities/tweet.entity";
import { Like } from "src/likes/entities/like.entity";


@Entity({ name: 'users' })
export class User {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @OneToMany(() => Tweet, (tweet) => tweet.user)
    tweets: Tweet[];

    @Column({ type: 'varchar', length: 255, default: '/uploads/user/images/default.png' })
    avatar: string;

    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role' })
    role: Role;

    @Column({ name: 'role' })
    role_id: number;

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

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

    @BeforeInsert()
    private async generateHash(){
        this.password = await bcrypt.hash(this.password, 12);
    }

    async verifyPassword(password: string): Promise<boolean>{
        return await bcrypt.compare(password, this.password);
    }
}