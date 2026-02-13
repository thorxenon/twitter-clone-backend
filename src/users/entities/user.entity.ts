import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    nickname: string;

    @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, default: '/uploads/user/images/default.png' })
    avatar: string;

    @Column({ type: 'longtext', nullable: true })
    bio: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    link: string;
    
    @Column({ type: 'varchar', length: 255 })
    full_name: string;

    @Column({ type: 'date' })
    birth_date: Date;
}