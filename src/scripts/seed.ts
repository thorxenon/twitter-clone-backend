import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./../app.module";
import { DatabaseSeeder } from "./../database/database.seeder";
import { RolesSeeder } from "./../database/role.seeder";
import { PermissionSeeder } from "./../database/permission.seeder";

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