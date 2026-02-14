import { join } from "path";
import dotenv from 'dotenv';
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

dotenv.config();
const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [join(process.cwd(), 'src', '**', '*.entity.{ts}')],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false

})