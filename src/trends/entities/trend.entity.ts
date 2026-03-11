import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "trends" })
export class Trend {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    hashtag: string;

    @Column({ type: 'bigint', nullable: true, default: 0 })
    count: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
