import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrate1773101511664 implements MigrationInterface {
    name = 'InitialMigrate1773101511664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("id" SERIAL NOT NULL, "role" integer NOT NULL, "permission" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_298f2c0e2ea45289aa0c4ac8a02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tweet_likes" ("id" SERIAL NOT NULL, "tweet_id" integer NOT NULL, "user_slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_33024b6b7511aac316145b29e59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tweets" ("id" SERIAL NOT NULL, "user_slug" character varying(255) NOT NULL, "body" text NOT NULL, "reply_to_id" integer, "quoted_tweet_id" integer, "likes_count" integer NOT NULL DEFAULT '0', "image" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19d841599ad812c558807aec76c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "follower" character varying NOT NULL, "following" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("slug" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "avatar" character varying(255) NOT NULL DEFAULT '/uploads/user-avatar/default.png', "cover" character varying(255) NOT NULL DEFAULT '/uploads/user-cover/cover.jpg', "role" integer NOT NULL, "bio" text, "link" character varying(255), "name" character varying(255) NOT NULL, "birth_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_bc0c27d77ee64f0a097a5c269b3" PRIMARY KEY ("slug"))`);
        await queryRunner.query(`CREATE TABLE "trends" ("id" SERIAL NOT NULL, "hashtag" character varying(255) NOT NULL, "count" bigint DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d51fb2f9c7fa24cb4bf4e1fe3ef" UNIQUE ("hashtag"), CONSTRAINT "PK_4de18eea43d948e5ea66520e0e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_4f10596f80557ae6154e9174922" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_2adf6a8f8f904e32f306f82579a" FOREIGN KEY ("permission") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweet_likes" ADD CONSTRAINT "FK_b08a22eba5b3c4b56e5666f44a6" FOREIGN KEY ("tweet_id") REFERENCES "tweets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweet_likes" ADD CONSTRAINT "FK_f936c9c4e978a598c6d4f0863b4" FOREIGN KEY ("user_slug") REFERENCES "users"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweets" ADD CONSTRAINT "FK_609ee8d982a69a8c7e825f72e44" FOREIGN KEY ("user_slug") REFERENCES "users"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweets" ADD CONSTRAINT "FK_d9bb80bda2cfc9784559e18bca4" FOREIGN KEY ("reply_to_id") REFERENCES "tweets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweets" ADD CONSTRAINT "FK_ce890e2e6512e4c3c2ec1c07ced" FOREIGN KEY ("quoted_tweet_id") REFERENCES "tweets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_14d98e4bad6ca7e59ce0d84d85b" FOREIGN KEY ("follower") REFERENCES "users"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_34781705022d44763c41125566f" FOREIGN KEY ("following") REFERENCES "users"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_34781705022d44763c41125566f"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_14d98e4bad6ca7e59ce0d84d85b"`);
        await queryRunner.query(`ALTER TABLE "tweets" DROP CONSTRAINT "FK_ce890e2e6512e4c3c2ec1c07ced"`);
        await queryRunner.query(`ALTER TABLE "tweets" DROP CONSTRAINT "FK_d9bb80bda2cfc9784559e18bca4"`);
        await queryRunner.query(`ALTER TABLE "tweets" DROP CONSTRAINT "FK_609ee8d982a69a8c7e825f72e44"`);
        await queryRunner.query(`ALTER TABLE "tweet_likes" DROP CONSTRAINT "FK_f936c9c4e978a598c6d4f0863b4"`);
        await queryRunner.query(`ALTER TABLE "tweet_likes" DROP CONSTRAINT "FK_b08a22eba5b3c4b56e5666f44a6"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_2adf6a8f8f904e32f306f82579a"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_4f10596f80557ae6154e9174922"`);
        await queryRunner.query(`DROP TABLE "trends"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "tweets"`);
        await queryRunner.query(`DROP TABLE "tweet_likes"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
