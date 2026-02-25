import { Tweet } from "../../tweets/entities/tweet.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";


@Entity({ name: 'tweet_likes' })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tweet, (tweet) => tweet.likes)
    @JoinColumn({ name: 'tweet_id' })
    tweet: Relation<Tweet>;

    @Column({ name: 'tweet_id' })
    tweetId: number;

    @ManyToOne(() => User, (user) => user.slug)
    @JoinColumn({ name: 'user_slug' })
    user: Relation<User>;

    @Column({ name: 'user_slug' })
    userSlug: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
