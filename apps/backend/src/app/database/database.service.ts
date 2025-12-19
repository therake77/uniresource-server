import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
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
import { NewResource } from "../models/common/newResourceDto";
import { AuthorEntity } from "./models/model.author";
import { AccessRegisterEntity } from "./models/accessRegister";
import { RequestDto, RequestObject } from "../models/common/requestDto";
import * as fs from "fs";
import { copyFile, unlink } from 'fs/promises';
import { Role } from "../models/common/roles";
import { RequestEntity, ResourceRequestEntity, UserRequestEntity } from "./models/model.requests";
import { basename, join } from "path";

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
        @InjectRepository(UserRequestEntity)
        private readonly userRequestRegister: Repository<UserRequestEntity>,
        @InjectRepository(ResourceRequestEntity)
        private readonly rsrcRequestRegister: Repository<ResourceRequestEntity>,
        @InjectRepository(RequestEntity)
        private readonly baseRequestRegister: Repository<RequestEntity>
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

    private async saveNewResourceIntoDatabase(user:UserEntity,toBeSaved:NewResource):Promise<ResourceEntity>{
        const authorsFound = await this.convertAndSafeRawAuthors(toBeSaved.authors);
        console.log(authorsFound);
        if(authorsFound.length == 0){
            throw new InternalServerErrorException("(databaseService) cannot found or create any author. skipping");
        }
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
        return resourceCreated;
    }

    async saveRequest(request : RequestObject):Promise<number>{
        const user = await this.userRepository.findOne({
            where: {user_id : request.requestor}
        })

        if(!user){
            throw new NotFoundException("saveRequest: User not found");
        }
        if(request.requestType === RequestObject.collabRequest){
            const requestCreated = await this.userRequestRegister.save({
                requestor:user,
                request_type: request.requestType,
            })
            return requestCreated.request_id;
        }
        else if(request.requestType === RequestObject.uploadRequest){
            //first save the new resource information in the database
            const toBeSaved = request.object_affecting as NewResource
            const new_rsrc = await this.saveNewResourceIntoDatabase(user,toBeSaved);
            const requestCreated = await this.rsrcRequestRegister.save({
                requestor:user,
                request_type: request.requestType,
                object_affecting : new_rsrc
            })
            return requestCreated.request_id
        }
        else if(request.requestType === RequestObject.updateRequest){
            const toModify = await this.resourceRepository.findOne({
                where : {rsrc_id : request.object_affected as number}
            })
            if(!toModify){
                throw new NotFoundException("Resource to modify cannot be found");
            }
            const toBeSaved = request.object_affecting as NewResource
            const new_rsrc = await this.saveNewResourceIntoDatabase(user,toBeSaved);
            return (await this.rsrcRequestRegister.save({
                requestor: user,
                request_type: request.requestType,
                object_affected:toModify,
                object_affecting: new_rsrc
            })).request_id
        }
        else if( request.requestType === RequestObject.deleteRequest){
            const toDelete = await this.resourceRepository.findOne({
                where: {rsrc_id : request.object_affected as number}
            })
            if(!toDelete){
                throw new NotFoundException("Resource to delete cannot be found")
            }
            return (await this.rsrcRequestRegister.save({
                requestor: user,
                request_type: request.requestType,
                object_affected : toDelete
            })).request_id
        }else{
            throw new BadRequestException("Request type is not valid");
        }
    }

    async findResourceByCriteria(filters:SearchResourceDto): Promise<ResultDto[]>{
        const qb = this.resourceRepository.createQueryBuilder('resource')
        qb.innerJoinAndSelect('resource.resourceMetadata','metadata')
        .leftJoinAndSelect('resource.authors','author')
        .leftJoinAndSelect('resource.policy','policy')
        .where('policy.canBeIndexed = TRUE')
        if(filters.authors){
            qb.andWhere('author.author_name IN (...:author_names)',{author_names:filters.authors});
            console.log("author field detected")
        }
        if(filters.course){
            qb.andWhere('metadata.course = :course',{course: filters.course})
        }
        if(filters.dateOfPublish){
            qb.andWhere('metadata.publish_date = :date',{date : filters.dateOfPublish})
        }
        if(filters.name){
            qb.andWhere('metadata.name = :name',{name : filters.name})
            console.log(`name field detected ${filters.name}`)
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
        console.log(raw_result);
        if(raw_result.length == 0){
            throw new NotFoundException();
        }

        return this.convertRawResultToDto(raw_result);
    }

    async getRequestsByCollab(user: User):Promise<RequestDto[]>{
        
        const userFound = await this.userRepository.findOne({
            where: {user_id : user.id}
        })
        
        if(!userFound){
            throw new NotFoundException("(fatal) databaseService: Cannot find user");
        }

        const collabRequestsFound:UserRequestEntity[] = await this.userRequestRegister.find({
            where: {requestor: userFound},
            relations:{
                requestor:true
            }
        })

        const rsrcRequestsFound:ResourceRequestEntity[] = await this.rsrcRequestRegister.find({
            where: {requestor : userFound},
            relations:{
                requestor:true,
                object_affected:true,
                object_affecting:true
            }
        })
        const result:RequestDto[] = []
        for(const r of collabRequestsFound){
            result.push(this.parseUserRequestToRequestDto(r))
        }
        for(const r of rsrcRequestsFound){
            result.push(this.parseResourceRequestToRequestDto(r))
        }
        if(result.length == 0){
            throw new NotFoundException("No requests were found");
        }
        return result
    }
    private parseUserRequestToRequestDto(r:UserRequestEntity):RequestDto{
        return {
            request_id : r.request_id,
            requestType: r.request_type,
            requestor: r.requestor.user_id,
            status:r.approved
        }
    }
    private parseResourceRequestToRequestDto(r:ResourceRequestEntity):RequestDto{
        switch(r.request_type){
            case(RequestObject.uploadRequest):{
                return {
                    request_id : r.request_id,
                    requestType: r.request_type,
                    requestor: r.requestor.user_id,
                    obj_affecting: r.object_affecting!.rsrc_id,
                    status : r.approved
                    
                }
            }
            case(RequestObject.updateRequest):{
                return{
                    request_id : r.request_id,
                    requestType: r.request_type,
                    requestor : r.requestor.user_id,
                    obj_affecting : r.object_affecting!.rsrc_id,
                    obj_affected : r.object_affected!.rsrc_id,
                    status : r.approved
                }
            }
            case(RequestObject.deleteRequest):{
                return{
                    request_id : r.request_id,
                    requestType: r.request_type,
                    requestor: r.requestor.user_id,
                    obj_affected : r.object_affected!.rsrc_id,
                    status : r.approved
                }
            }
            default:{
                throw new InternalServerErrorException("(DatabaseService): Cannot parse request type")
            }
        }
    }

    async searchResourcesByCollab(user: User): Promise<ResultDto[]>{
        const userEnt= await this.userRepository.findOne({
            where:{user_id: user.id},
            relations:{
                responsible_of:{
                    authors:true,
                    resourceMetadata:true
                }
            }
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
        const userRequests:UserRequestEntity[] = await this.userRequestRegister.find({
            relations:{
                requestor:true
            }
        })
        const rsrcRequests:ResourceRequestEntity[] = await this.rsrcRequestRegister.find({
            relations:{
                requestor:true,
                object_affected:true,
                object_affecting:true
            }
        })
        const toReturn:RequestDto[] = [];
        for(const r of userRequests){
            toReturn.push(this.parseUserRequestToRequestDto(r))
        }
        for(const r of rsrcRequests){
            toReturn.push(this.parseResourceRequestToRequestDto(r))
        }
        if(toReturn.length == 0){
            throw new NotFoundException("There are no requests");
        }
        return toReturn;
    }
    
    async markRequestAsApproved(requestId:number){
        const rsrcBaseFound = await this.baseRequestRegister.findOne({
            where: {request_id : requestId}
        })
        if(!rsrcBaseFound){
            throw new InternalServerErrorException("Base request cannot be found");
        }
        rsrcBaseFound.approved = "APROBADO";
        await this.baseRequestRegister.save(rsrcBaseFound);
        return
    }

    async getRequest(requestId:number){
        const requestFound = await this.baseRequestRegister.findOne({
            where : {request_id:requestId},
        })
        if(!requestFound){
            throw new NotFoundException("(GetRequest) Cannot found request");
        }
        else if(requestFound.request_type == RequestObject.collabRequest){
            const trueRequest = await this.userRequestRegister.findOne({
                where: {request_id : requestId},
                relations:{
                    requestor : true
                }
            });
            if(!trueRequest){
                throw new InternalServerErrorException("Cannot found user request");
            }
            return trueRequest;
        }
        else{
            const trueRequest = await this.rsrcRequestRegister.findOne({
                where : {request_id : requestId},
                relations : {
                    requestor : true,
                    object_affected : true,
                    object_affecting : true
                }
            })
            if(!trueRequest){
                throw new InternalServerErrorException("Cannot found rsrc request");
            }
            return trueRequest;
        }
    }

    async addRoleToUser(userId:number,role:string){
        //first, find the user
        const user = await this.userRepository.findOne({
            where:{user_id : userId},
            relations:{
                roles:true,
                permits:true
            }
        })
        if(!user){
            throw new NotFoundException("No user found")
        }
        const roleEnt = await this.roleRespository.findOne({
            where: {role_name : role},
            relations:{
                permitsAllowed: true
            }
        })
        if(!roleEnt){
            throw new NotFoundException("No role found")
        }
        //update
        user.roles.push(roleEnt)
        for(const p of roleEnt.permitsAllowed){
            user.permits.push(p)
        }
        //save updated object
        await this.userRepository.save(user)
        return
    }

    async deleteResource(rsrcId:number){
        const resource = await this.resourceRepository.findOne({
            where: {rsrc_id : rsrcId}
        })
        if(!resource){
            throw new NotFoundException("No resource found for deletion")
        }
        await this.resourceRepository.remove(resource)
    }
    async moveFile( source: string, destination: string) {
        try {
            await fs.promises.rename(source, destination);
        } catch (err: any) {
            if (err.code === 'EXDEV') {
                await copyFile(source, destination);
                await unlink(source);
            } else {
                throw err;
            }
        }
    }
    async uploadResource(rsrcId:number){
        const resource = await this.resourceRepository.findOne({
            where: {rsrc_id: rsrcId},
            relations:{
                policy:true,
                resourceMetadata:true
            }
        })
        if(!resource){
            throw new NotFoundException("No resource found for upload")
        }
        resource.policy.canBeIndexed = true;
        //changing path logic:
        const currDate = Date.now()
        resource.resourceMetadata.upload_date = new Date(currDate);
        const currPath = join(process.cwd(),resource.path);
        const newPath = join("storage/permanent",basename(resource.path));
        //storage/permanent/(file-name)
        await this.moveFile(currPath,newPath);
        resource.path = newPath;
        try{
            const saved = await this.resourceRepository.save(resource);
            return saved.rsrc_id;
        }catch(err){
            this.moveFile(newPath,currPath);
            throw new InternalServerErrorException("Cannot save file");
        }
    }

    async updateResource(source:number,affected:number){
        throw new NotImplementedException("Still not implemented");
    }

    async denyRequest(reqId:number){
        const request = await this.baseRequestRegister.findOne({
            where:{request_id : reqId}
        })
        if(!request){
            throw new NotFoundException("Request not found");
        }
        request.approved = 'DENEGADO'
        this.baseRequestRegister.save(request)
        return
    }

    async findRequest(requestType:string,requestorId:number){
        if(requestType == RequestObject.collabRequest){
            const found = await this.userRequestRegister.find({
                where : {
                    requestor:{
                        user_id : requestorId
                    },
                    approved: Not("DENEGADO")
                },
            })
            return found
        }
        else{
            return await this.rsrcRequestRegister.find({
                where : {
                    requestor:{
                        user_id : requestorId
                    },
                    approved: Not("DENEGADO")
                },
            })
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