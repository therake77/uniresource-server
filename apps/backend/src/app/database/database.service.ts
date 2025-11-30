import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { UserEntity } from "./models/model.user";
import { User } from "../models/common/user";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { Role } from "../models/common/roles";
import { Permit } from "../models/common/permits";
import { ResourceEntity } from "./models/model.rsrcEnt";
import { SearchResourceDto } from "../models/dto/searchResource";
import { ResourceReference } from "../models/common/resource_ref";

@Injectable()
export class DatabaseService{
    
    constructor(
        @InjectDataSource()
        private readonly dataSource:DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
        @InjectRepository(ResourceEntity)
        private readonly resourceRepository:Repository<ResourceEntity>
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

    async buildReference(id: number){
        const qb = this.resourceRepository.createQueryBuilder('r')
        qb.innerJoin('r.metadata','m')
        qb.innerJoin('r.authors','a')
        qb.andWhere('m.rsrc_id = :id',{id:id})
        qb.select([
            'm.rsrc_id',
            'm.name',
            'm.type'
        ])
        //TODO(finish this)
        return qb.getRawOne()
    }

    async findUserById(id:number){
        return await this.userRepository.findOneBy({ user_id: id})
    }   

    async findResourceByCriteria(filters:SearchResourceDto){
        const qb = this.resourceRepository.createQueryBuilder('resource')
        qb.innerJoin('resource.resourceMetadata','metadata')
        .innerJoin('resource.authors','author')
        .innerJoin('resource.policy','policy')
        .where('policy.canBeIndexed = TRUE')
        if(filters.authors){
            qb.andWhere('author.author_name IN (...:author_names)',{author_names:filters.authors});
        }
        if(filters.course){
            qb.andWhere('metadata.course = :course',{course: filters.course})
        }
        if(filters.dateOfPublish){
            qb.andWhere('metadata.publish_date = :date',{date : filters.dateOfPublish})
        }
        if(filters.name){
            qb.andWhere('metadata.name = :name',{name : filters.name})
        }
        if(filters.school){
            qb.andWhere('metadata.school = :school',{school:filters.school})
        }
        if(filters.semester){
            qb.andWhere('metadata.semester = :semester',{semester:filters.semester})
        }
        if(filters.type){
            qb.andWhere('metadata.type = :type',{type : filters.type})
        }
        qb.select(['metadata.name AS name'])
        return qb.getRawMany<{ id: number; name: string }>()
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