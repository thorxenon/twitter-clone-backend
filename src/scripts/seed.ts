import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { DatabaseSeeder } from "src/database/database.seeder";
import { RolesSeeder } from "src/database/role.seeder";
import { PermissionSeeder } from "src/database/permission.seeder";

async function runSeeder(){
    const app = await NestFactory.createApplicationContext(AppModule);
    const permissionSeeder = app.get(PermissionSeeder);
    const roleSeeder = app.get(RolesSeeder);
    const seeder = app.get(DatabaseSeeder);
    

    await permissionSeeder.seed();
    await roleSeeder.seed();
    await seeder.seed();
    
    await app.close();
}


runSeeder().catch((error)=>{
    console.error("Error running seeder:", error);
    process.exit(1);
})