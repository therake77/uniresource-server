import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm/browser";
import { DataSource } from "typeorm/browser";
import { User } from "./models/user";

@Injectable()
export class DatabaseService{
    constructor(
        @InjectDataSource()
        private readonly dataSource:DataSource,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async findUserWithPassword(username:string,password:string){
        const user:User|null = await this.userRepository.findOneBy({username,password})
        if(!user){
            return null
        }
        return {
            username : user.username,
            email: user.email,
            password: user.password,
        }
    }


    getRespository<T extends ObjectLiteral> (entity: EntityTarget<T>): Repository<T> {
        return this.dataSource.getRepository(entity);    
    }

    query(sql:string, params?: any[]){

    }

}