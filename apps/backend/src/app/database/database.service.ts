import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
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
import { NewResource, NewResourceDto } from "../models/common/newResourceDto";
import { AuthorEntity } from "./models/model.author";
import { AccessRegisterEntity } from "./models/accessRegister";
import { RequestObject } from "../models/common/requestDto";
import { RequestEntity } from "./models/model.requests";
import { Role } from "../models/common/roles";

@Injectable()
export class DatabaseService{
    
    constructor(
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
        private readonly authorRepository: Repository<AuthorEntity>,
        @InjectRepository(AccessRegisterEntity)
        private readonly accessRegister: Repository<AccessRegisterEntity>,
        @InjectRepository(RequestEntity)
        private readonly requestRegister: Repository<RequestEntity>
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
            policies : rsc_policy,
            responsibleUserId: rsrcEntFound.responsible.user_id
        }
        return rsrcObj;
    }

    async registerAccessActivity(userId:number,rsrc_id:number, accessType:string){
        //first find the user and the resource
        const user = await this.userRepository.findOne({
            where: {user_id : userId}
        })
        const resourceObj = await this.resourceRepository.findOne({
            where: {rsrc_id : rsrc_id}
        })
        
        if(!user || !resourceObj){
            throw new NotFoundException("Cannot identify user or resourceObj");
        }

        //Now save in the register
        this.accessRegister.save({
            resourceAccessed: resourceObj,
            accessedBy: user,
            accessType: accessType
        })
        return
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
        if(requestedRole === Role.USER){
            console.log(userFound.permits);
            foundPermits = await this.fromPermitEntityToPermit(userFound.permits,UserPermit);    
        }else if(requestedRole === Role.COLLAB){
            foundPermits = await this.fromPermitEntityToPermit(userFound.permits,ColabPermits);
        }else if( requestedRole === Role.ADMIN)
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

    async saveRequest(request : RequestObject){
        const user = await this.userRepository.findOne({
            where: {user_id : request.requestor.id}
        })

        if(!user){
            throw new NotFoundException("saveRequest: User not found");
        }
        let requestCreated:RequestEntity | undefined = undefined;
        switch(request.requestType){
            case(RequestObject.collabRequest):{
                requestCreated = await this.requestRegister.save({
                    requestor:user,
                    request_type: request.requestType,
                    object_affected: (request.object_affected as number)
                })
                break;
            }
            case(RequestObject.uploadRequest):{
                //first: save the temp object data
                const toBeSaved = request.object_affecting as NewResource;
                //construct: the metadata, the policy object and the authors to be inserted object
                //authors
                const authorsFound = await this.convertAndSafeRawAuthors(toBeSaved.authors);
                if(authorsFound.length == 0){
                    throw new InternalServerErrorException("(databaseService) cannot found or create any author. skipping");
                }
                //save resource
                const resourceCreated = await this.resourceRepository.save({
                    path: toBeSaved.path,
                    resourceMetadata: {
                        name : toBeSaved.resourceMetadata.name,
                        type : toBeSaved.resourceMetadata.type,
                        publish_date : toBeSaved.resourceMetadata.publish_date,
                        upload_date : toBeSaved.resourceMetadata.upload_date,
                        course : toBeSaved.resourceMetadata.course,
                        semester : toBeSaved.resourceMetadata.semester,
                        school : toBeSaved.resourceMetadata.school,
                        description : toBeSaved.resourceMetadata.description,
                    },
                    policy:{
                        canBeDownload: toBeSaved.policy.canBeDownloaded,
                        canBeIndexed: toBeSaved.policy.canBeIndexed
                    },
                    authors: authorsFound,
                    responsible: user,
                })

                requestCreated = await this.requestRegister.save({
                    request_type: request.requestType,
                    requestor: user,
                    object_affecting: resourceCreated.rsrc_id
                })
                break;
            }
            case(RequestObject.updateRequest):{
                const toBeModified = request.object_affected as ResourceObject
                const toBeSaved = request.object_affecting as NewResource
                //so, first we need to save the modifier object
                //retrieve the authors
                const authorsFound = await this.convertAndSafeRawAuthors(toBeSaved.authors);
                if(authorsFound.length == 0){
                    throw new InternalServerErrorException("(databaseService) cannot found or create any author. skipping");
                }

                //the resource created, finally
                const resourceCreated = await this.resourceRepository.save({
                    path: toBeSaved.path,
                    resourceMetadata:{
                        name : toBeSaved.resourceMetadata.name,
                        type : toBeSaved.resourceMetadata.type,
                        publish_date : toBeSaved.resourceMetadata.publish_date,
                        upload_date : toBeSaved.resourceMetadata.upload_date,
                        course : toBeSaved.resourceMetadata.course,
                        semester : toBeSaved.resourceMetadata.semester,
                        school : toBeSaved.resourceMetadata.school,
                        description : toBeSaved.resourceMetadata.description,
                    },
                    policy: {
                        canBeDownload: toBeSaved.policy.canBeDownloaded,
                        canBeIndexed: toBeSaved.policy.canBeIndexed
                    },
                    authors: authorsFound,
                    responsible: user,
                })
                //now, save the request
                requestCreated = await this.requestRegister.save({
                    requestor: user,
                    request_type: request.requestType,
                    object_affected: toBeModified.rsrc_id,
                    object_affecting: resourceCreated.rsrc_id
                })
                break;
            }
            case(RequestObject.deleteRequest):{
                //this is quite easy. the resource already exists, so save the request directly
                const toBeDeleted = request.object_affected as ResourceEntity;
                
                requestCreated = await this.requestRegister.save({
                    requestor: user,
                    request_type: request.requestType,
                    object_affected: toBeDeleted.rsrc_id
                })
                
                break;
            }
        }
        if(requestCreated === undefined){
            throw new InternalServerErrorException("(databaseService) Cannot identify request type");
        }
        
        return requestCreated.request_id;
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

    async getRequestsByCollab(user: User):Promise<RequestObject[]>{
        
        const userFound = await this.userRepository.findOne({
            where: {user_id : user.id}
        })
        
        if(!userFound){
            throw new NotFoundException("(fatal) databaseService: Cannot find user");
        }

        const requestsFound:RequestEntity[] = await this.requestRegister.find({
            where: {requestor: userFound}
        })

        if(requestsFound.length == 0){
            throw new NotFoundException("there is no requests associated with this user");
        }

        return requestsFound.map((request)=>{
            return {
                requestType:request.request_type,
                object_affected:request.object_affected,
                object_affecting:request.object_affecting,
                requestor:user
            }
        });
    }

    async searchResourcesByCollab(user: User): Promise<ResultDto[]>{
        const userEnt= await this.userRepository.findOne({
            where:{user_id: user.id}
        })
        if(!userEnt){
            throw new NotFoundException("User entity cannot be found");
        }
        
        const resources:ResourceEntity[] = userEnt.responsible_of;
        
        if(resources.length == 0){
            throw new NotFoundException("Collaborator doesn't have any resources associated with him");
        }

        return resources.map((rsrc)=>{
            return {
                rsrc_id: rsrc.rsrc_id,
                name: rsrc.resourceMetadata.name,
                authors : rsrc.authors.map((author)=>(author.author_name))
            }
        })
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
        if(!foundUser){
            return null
        }
        let foundPermits;
        if(role === Role.USER){
            console.log(foundUser.permits);
            foundPermits = await this.fromPermitEntityToPermit(foundUser.permits,UserPermit);    
        }else if(role === Role.COLLAB){
            foundPermits = await this.fromPermitEntityToPermit(foundUser.permits,ColabPermits);
        }else if( role === Role.ADMIN)
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

    async getRequests(){
        const requests:RequestEntity[] =  await this.requestRegister.find();
        const toReturn:{req_id:number;req_type:string; object_affected?:number,object_affecting?:number}[] = [];
        for(const req of requests){
            switch(req.request_type){
                case(RequestObject.collabRequest || RequestObject.deleteRequest):{
                    toReturn.push({
                        req_id : req.request_id,
                        req_type : req.request_type,
                        object_affected : req.object_affected
                    })
                    break;
                }
                case(RequestObject.uploadRequest):{
                    toReturn.push({
                        req_id : req.request_id,
                        req_type : req.request_type,
                        object_affecting : req.object_affecting
                    })
                    break;
                }
                case(RequestObject.updateRequest):{
                    toReturn.push({
                        req_id : req.request_id,
                        req_type : req.request_type,
                        object_affected: req.object_affected,
                        object_affecting : req.object_affecting
                    })
                    break;
                }
            }
        }
        if(toReturn.length == 0){
            throw new NotFoundException("There are no requests");
        }
        return toReturn;
    }

    async getRequest(requestId:number){
        //first get the requestEntity to know which type of requests we are dealing with
        const requestFound = await this.requestRegister.findOne({
            where : {request_id : requestId}
        })
        if(!requestFound){
            throw new NotFoundException("Cannot found request");
        }
        //now, check the type
        switch(requestFound.request_type){
            case(RequestObject.collabRequest):{
                //so here the most important thing is to get the user information
                const user = await this.userRepository.findOne({
                    where:{user_id : requestFound.object_affected as number}
                })
                //TO FIX: ¿What if the user was deleted? fix request model
                if(!user){
                    throw new NotFoundException("Cannot found user on the request");
                }
                return {
                    requestType: requestFound.request_type,
                    requestor: user,
                    object_affected: user
                }
            }
            case(RequestObject.uploadRequest):{
                break;
            }
            case(RequestObject.updateRequest):{
                break;
            }
            case(RequestObject.deleteRequest):{
                break;
            }
            
        }

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

    private async convertAndSafeRawAuthors(authorsList:string[]){
        return await Promise.all( authorsList.map(async (author)=>{
            const authorEntityFound = await this.authorRepository.findOne({
                where : {author_name: author}
            })
            if(!authorEntityFound){
                const authorEntitySaved = await this.authorRepository.save({
                    author_name: author
                })
                return authorEntitySaved;
            }
            return authorEntityFound;
        })
        )
    }
}