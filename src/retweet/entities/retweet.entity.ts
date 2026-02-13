import { Tweet } from "src/tweets/entities/tweet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'retweets' })
export class Retweet {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'user_nickname' })
    @ManyToOne(() => User, (user) => user.nickname)
    user: User;

    @Column({ name: 'user_nickname' })
    userNickname: string;

    @JoinColumn({ name: 'tweet_id' })
    @ManyToOne(() => Tweet, (tweet) => tweet.id)
    tweet: Tweet;

    @Column({ name: 'tweet_id' })
    tweetId: number;

    @Column({ type: 'text', nullable: true })
    body: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
