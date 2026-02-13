import { Retweet } from "src/retweet/entities/retweet.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tweets' })
export class Tweet {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({ name: 'user_nickname' })
    @ManyToOne(() => User, (user) => user.nickname)
    user: User;

    @Column({ name: 'user_nickname' })
    userNickname: string;

    @Column({ type: 'text', nullable: false })
    body: string;

    @ManyToOne(() => Tweet, (tweet) => tweet.id)
    @JoinColumn({ name: 'parent_tweet' })
    parentTweet: Tweet;

    @OneToMany(() => Retweet, (retweet) => retweet.tweet)
    retweets: Retweet[];

    @Column({ name: 'parent_tweet', nullable: true })
    parentTweetId: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    @OneToMany(() => Tweet, (tweet) => tweet.parentTweet)
    replies: Tweet[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
