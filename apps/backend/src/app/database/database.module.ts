import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./models";

@Module({
    imports:[ConfigModule, TypeOrmModule.forRootAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: (config : ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USR'),
            password: config.get<string>('DB_PASSWRD'),
            database: config.get<string>('DB_NAME'),
            entities : entities,
            synchronize: true
        }),
    }),
    TypeOrmModule.forFeature(entities)
    ],
    controllers:[],
    providers:[DatabaseService],
    exports:[DatabaseService]
})
export class DatabaseModule{}