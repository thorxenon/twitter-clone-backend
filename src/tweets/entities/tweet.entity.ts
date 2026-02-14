import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Like } from "src/likes/entities/like.entity";

@Entity({ name: "tweets" })
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tweets)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ type: "text", nullable: false })
  body: string;

  // ===== REPLY (estrutura hierárquica) =====
  @ManyToOne(() => Tweet, (tweet) => tweet.replies, { nullable: true })
  @JoinColumn({ name: "reply_to_id" })
  replyTo: Tweet;

  @Column({ name: "reply_to_id", nullable: true })
  replyToId: number;

  @OneToMany(() => Tweet, (tweet) => tweet.replyTo)
  replies: Tweet[];

  // ===== QUOTE TWEET =====
  @ManyToOne(() => Tweet, { nullable: true })
  @JoinColumn({ name: "quoted_tweet_id" })
  quotedTweet: Tweet;

  @Column({ name: "quoted_tweet_id", nullable: true })
  quotedTweetId: number;

  @OneToMany(() => Like, (like) => like.tweet)
  likes: Like[];

  @Column({ name: "likes_count", default: 0 })
  likesCount: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  image: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
