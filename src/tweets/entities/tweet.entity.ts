import { User } from "../../users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Like } from "../../likes/entities/like.entity";
import type { Relation } from "typeorm";

@Entity({ name: "tweets" })
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.slug)
  @JoinColumn({ name: "user_slug" })
  user: Relation<User>;

  @Column({ name: "user_slug", type: "varchar", length: 255 })
  userSlug: string;

  @Column({ type: "text", nullable: false })
  body: string;

  // ===== REPLY (estrutura hierárquica) =====
  @ManyToOne(() => Tweet, (tweet) => tweet.replies, { nullable: true })
  @JoinColumn({ name: "reply_to_id" })
  replyTo: Relation<Tweet>;

  @Column({ name: "reply_to_id", nullable: true })
  replyToId: number;

  @OneToMany(() => Tweet, (tweet) => tweet.replyTo)
  replies: Relation<Tweet[]>;

  // ===== QUOTE TWEET =====
  @ManyToOne(() => Tweet, { nullable: true })
  @JoinColumn({ name: "quoted_tweet_id" })
  quotedTweet: Relation<Tweet>;

  @Column({ name: "quoted_tweet_id", nullable: true })
  quotedTweetId: number;

  @OneToMany(() => Like, (like) => like.tweet)
  likes: Relation<Like[]>;

  @Column({ name: "likes_count", default: 0 })
  likesCount: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  image: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
