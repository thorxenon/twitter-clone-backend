import { join } from "path";
import 'dotenv/config'; // Forma mais moderna de importar e configurar
import { DataSource, DataSourceOptions } from "typeorm";

// A configuração é definida aqui
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Aponta para os arquivos compilados (.js) em produção
    // e para os arquivos typescript (.ts) em desenvolvimento
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', '..', 'migrations', '*{.ts,.js}')],
    synchronize: false,

    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrationsTransactionMode: 'all'
};

// A instância do DataSource é criada a partir das opções
const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;



// import { join } from "path";
// import dotenv from 'dotenv';
// import { DataSource } from "typeorm";
// import { ConfigService } from "@nestjs/config";

// dotenv.config();
// const configService = new ConfigService();

// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT as string),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     entities: [join(process.cwd(), 'src', '**', '*.entity.{ts}')],
//     migrations: ['src/migrations/*{.ts,.js}'],
//     synchronize: true

// });