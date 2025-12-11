import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, In, ObjectLiteral, Repository } from "typeorm";
import { DataSource } from "typeorm";
import { UserEntity } from "./models/model.user";
import { User } from "../models/common/user";
import { CreateUserDto } from "../models/dto/createUser.dto";
import { AdminPermits, ColabPermits, Permit, UserPermit } from "../models/common/permits";
import { ResourceEntity } from "./models/model.rsrcEnt";
import { SearchResourceDto } from "../models/dto/searchResource";
import { PermitEntity } from "./models/model.permit";
import { RoleEntity } from "./models/model.role";
import { ResourceObject } from "../models/common/resource_obj";
import { ResourceMetadataEntity } from "./models/model.rsrcMeta";
import { ResourceReference } from "../models/common/resource_ref";
import { ResourcePolicy } from "./models/model.policy";
import { Policy } from "../models/common/policy";
import { ResultDto } from "../models/dto/result.dto";
import { NewResourceDto } from "../models/common/newResourceDto";
import { AuthorEntity } from "./models/model.author";

@Injectable()
export class DatabaseService{
    
    constructor(
        @InjectDataSource()
        private readonly dataSource:DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
        @InjectRepository(ResourceEntity)
        private readonly resourceRepository:Repository<ResourceEntity>,
        @InjectRepository(PermitEntity)
        private readonly permitRepository: Repository<PermitEntity>,
        @InjectRepository(RoleEntity)
        private readonly roleRespository: Repository<RoleEntity>,
        @InjectRepository(ResourceMetadataEntity)
        private readonly rsrcMetadataRepository: Repository<ResourceMetadataEntity>,
        @InjectRepository(ResourcePolicy)
        private readonly rsrcPolicyRepository: Repository<ResourcePolicy>,
        @InjectRepository(AuthorEntity)
        private readonly authorRepository: Repository<AuthorEntity>
    ){}

    private async fromPermitToDatabaseEntities(permit:Permit): Promise<PermitEntity[]>{
        let listOfPermitsFound = Object.entries(permit).filter(
            ([_, value]) => (value)
        ).map(
            ([name]) => (name)   
        )
        return await this.permitRepository.find({
            where: {permit_name: In(listOfPermitsFound)}
        })
    }

    private fromResourcePolicyToPolicy(policy:ResourcePolicy):Policy{
        return {
            canBeDownloaded : policy.canBeDownload,
            canBeIndexed : policy.canBeIndexed
        }
    }

    private async fromPermitEntityToPermit<T extends Permit>(permitEntity:PermitEntity[], cls:{ new() : T }){
        const permit = new cls();
        const permitsFound = new Set(permitEntity.map((p) => (p.permit_name)));
        for(const key of Object.keys(permit) as (keyof T)[]){
            permit[key] = permitsFound.has(key as string) as T[keyof T];
        }
        return permit;
    }

    async saveUser(user:CreateUserDto,role:string,permits:Permit){
        
        const databasePermitsFound = await this.fromPermitToDatabaseEntities(permits); 
        const roleEntityFound = await this.roleRespository.findOne({
            where : {role_name: role}
        })

        if(databasePermitsFound.length == 0 || roleEntityFound == null){
            throw new InternalServerErrorException("Error saving user");
        }

        const newUser = this.userRepository.create({
            username: user.username,
            email: user.email,
            password: user.password,
            roles:[
                roleEntityFound
            ],
            permits: databasePermitsFound
        });
        this.userRepository.save([newUser])
    }

    async getResourceObject(id:number){
        //Returns a promise of a ResourceObject, or null if it doesn't exists
        const rsrcEntFound = await this.resourceRepository.findOne({
            where: {rsrc_id: id}
        })
        if(!rsrcEntFound){
            return null;
        }

        const rsc_policy = this.fromResourcePolicyToPolicy(rsrcEntFound.policy);
        

        const rsrcObj:ResourceObject = {
            rsrc_id : rsrcEntFound.rsrc_id!,
            path : rsrcEntFound.path,
            policies : rsc_policy
        }
        return rsrcObj;
    }

    async registerAccessActivity(userId:number,rsrc_id:number, accessType:string){

    }

    async findUser(userId:number,requestedRole:string):Promise<User | null>{
        const userFound = await this.userRepository.createQueryBuilder('u')
        .leftJoinAndSelect('u.roles','r')
        .leftJoinAndSelect('u.permits','p')
        .where('u.user_id = :id',{id:userId})
        .andWhere('r.role_name = :role',{role:requestedRole})
        .getOne()
        if(userFound == null){
            return null;
        }

        let foundPermits: UserPermit | ColabPermits | AdminPermits;
        if(requestedRole === 'USER'){
            console.log(userFound.permits);
            foundPermits = await this.fromPermitEntityToPermit(userFound.permits,UserPermit);    
        }else if(requestedRole === 'COLAB'){
            foundPermits = await this.fromPermitEntityToPermit(userFound.permits,ColabPermits);
        }else if( requestedRole === 'ADMIN')
            foundPermits = await this.fromPermitEntityToPermit(userFound.permits,AdminPermits);
        else{
            return null;
        }

        const user:User = {
            id:userFound.user_id,
            username:userFound.username,
            email:userFound.email,
            role:userFound.roles[0].role_name,
            permits:foundPermits
        }
        return user;
    }

    async findResourceReference(id:number):Promise<ResourceReference | null>{

        const rsrcRefFound:ResourceMetadataEntity | null = await this.rsrcMetadataRepository.findOne({
            where: {rsrc_id : id}
        })

        if(!rsrcRefFound){
            return null
        }

        const authorsFound:string[] = await this.resourceRepository.createQueryBuilder('r')
        .leftJoinAndSelect('r.authors','a')
        .where('r.rsrc_id = :id',{id:rsrcRefFound.rsrc_id})
        .select('a.author_name')
        .getRawMany<string>();

        
        const rsrc_ref:ResourceReference = {
            rsrc_id : rsrcRefFound.rsrc_id!,
            name : rsrcRefFound.name,
            type : rsrcRefFound.type,
            publish_date : rsrcRefFound.publish_date,
            upload_date : rsrcRefFound.upload_date,
            course : rsrcRefFound.course,
            semester : rsrcRefFound.semester,
            school : rsrcRefFound.school,
            description : rsrcRefFound.description,
            authors : authorsFound
        }
        return rsrc_ref;
    }

    saveRequest(request : any){

    }

    async findResourceByCriteria(filters:SearchResourceDto): Promise<ResultDto[]>{
        const qb = this.resourceRepository.createQueryBuilder('resource')
        qb.innerJoinAndSelect('resource.resourceMetadata','metadata')
        .leftJoinAndSelect('resource.authors','author')
        .leftJoinAndSelect('resource.policy','policy')
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
        qb.select(['resource.rsrc_id AS id', 'metadata.name AS name', 'author.author_name AS author_name'])
        const raw_result:{id: number; name:string; author_name:string }[] =  await qb.getRawMany<{id: number; name:string; author_name:string}>();
        
        if(raw_result.length == 0){
            throw new NotFoundException();
        }

        return this.convertRawResultToDto(raw_result);
    }

    getRequestsByCollab(user: User){

    }

    searchResourcesByCollab(user: User){

    }

    async findUserWithPassword(email:string,passwrd:string, role: string):Promise<User|null>{
        //finds a user in the database by email, password and role requested. Returns an User object
        //or null if no user was found
        const qb = this.userRepository.createQueryBuilder('u');
        qb.leftJoinAndSelect('u.roles','r')
        .leftJoinAndSelect('u.permits','p')
        .where('u.email = :email',{email: email})
        .andWhere('u.password = :password',{password : passwrd})
        .andWhere('r.role_name = :role',{role: role})

        const foundUser = await qb.getOne();
        console.log(foundUser)
        if(!foundUser){
            return null
        }
        let foundPermits;
        if(role === 'USER'){
            console.log(foundUser.permits);
            foundPermits = await this.fromPermitEntityToPermit(foundUser.permits,UserPermit);    
        }else if(role === 'COLAB'){
            foundPermits = await this.fromPermitEntityToPermit(foundUser.permits,ColabPermits);
        }else if( role === 'ADMIN')
            foundPermits = await this.fromPermitEntityToPermit(foundUser.permits,AdminPermits);
        else{
            return null;
        }

        const user:User = {
            id : foundUser.user_id,
            username : foundUser.username,
            email: foundUser.email,
            role : foundUser.roles[0].role_name,
            permits : foundPermits
        }

        return user;
    }

   //This is a temporal method
    async saveResource(newResource:{date:Date;filename:string,extra:NewResourceDto},user:User){
        //Construct the resource object
        const userFound = await this.userRepository.findOne({
            where:{ user_id: user.id}
        });
        
        if(!userFound){
            throw new NotFoundException("User not found for this operation");
        }

        const metadata = newResource.extra.metadata;
        //first, register the metadata entity, authors entities and resource policy entity
        const authorsSaved:AuthorEntity[] = await this.authorRepository.save(
            newResource.extra.authors.map((authorName:string)=>({author_name:authorName}))
        )
        
        const newRsrcEntity:ResourceEntity = await this.resourceRepository.save({
            path:newResource.filename,
            responsible:userFound,
            authors: authorsSaved  
        })

        this.rsrcMetadataRepository.save({
            name:metadata.name,
            type:metadata.type,
            publish_date:metadata.publish_date,
            upload_date:newResource.date,
            course:metadata.course,
            semester:metadata.semester,
            school:metadata.school,
            description:metadata.description,
            rsrc_ent:newRsrcEntity
        })

        this.rsrcPolicyRepository.save({
            rsrc_ent: newRsrcEntity,
            canBeDownload : newResource.extra.isDownloadable,
            canBeIndexed : true
        })

        
        
    }

    private convertRawResultToDto(raw:{id:number,name:string,author_name:string}[]):ResultDto[]{
        return Object.values(
            raw.reduce((acc:Record<number,ResultDto> , row) => {
                const id = row.id;
                if(!acc[id]){
                    acc[id] = {
                        rsrc_id : id,
                        name : row.name,
                        authors : []
                    };
                }

                if(row.author_name){
                    acc[id].authors.push(row.author_name);
                }
                return acc;
            },{}
            )
        );
    }
}