import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { DatabaseSeeder } from "src/database/database.seeder";

async function runSeeder(){
    const app = NestFactory.createApplicationContext(AppModule);
    const seeder = (await app).get(DatabaseSeeder);
    


    await seeder.seed();
}

runSeeder().catch((error)=>{
    console.error("Error running seeder:", error);
    process.exit(1);
})