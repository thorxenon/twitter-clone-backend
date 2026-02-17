import { Tweet } from "src/tweets/entities/tweet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tweet_likes' })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Tweet, (tweet) => tweet.likes)
    @JoinColumn({ name: 'tweet_id' })
    tweet: Tweet;

    @Column({ name: 'tweet_id' })
    tweetId: number;

    @ManyToOne(() => User, (user) => user.slug)
    @JoinColumn({ name: 'user_slug' })
    user: User;

    @Column({ name: 'user_slug' })
    userSlug: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
