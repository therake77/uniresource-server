import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { UserEntity } from "./models/model.user";
import { User } from "../models/common/user";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { Role } from "../models/common/roles";
import { Permit } from "../models/common/permits";

@Injectable()
export class DatabaseService{
    constructor(
        @InjectDataSource()
        private readonly dataSource:DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>
    ){}

    async findUserWithPassword(usrname:string,passwrd:string):Promise<User|null>{
        const user:UserEntity|null = await this.userRepository.findOneBy({
            username: usrname,
            password : passwrd
        })

        if(!user){
            return null
        }
        let foundUser = new User();
        Object.assign(foundUser,user)
        return foundUser
    }

    saveUser(user:CreateUserDto,role:Role,permits:Permit){
        let newUser = this.userRepository.create(user);
        this.userRepository.save([newUser])
    }

    getRespository<T extends ObjectLiteral> (entity: EntityTarget<T>): Repository<T> {
        return this.dataSource.getRepository(entity);    
    }

    query(sql:string, params?: any[]){
        //TODO(possible not necessary and will be removed)
        return
    }

}