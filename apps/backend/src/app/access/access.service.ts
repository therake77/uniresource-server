import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SearchResourceDto } from "../models/dto/searchResource";
import { DatabaseService } from "../database/database.service";
import { Token } from "../models/common/token";
import { ResourceReference } from "../models/common/resource_ref";
import { UserPermit } from "../models/common/permits";
import { join } from "path";
import { createReadStream } from "fs";
import { ReadStream } from "typeorm/platform/PlatformTools.js";


@Injectable()
export class AccessService{
    constructor(
        private readonly authService:AuthService,
        private readonly databaseService:DatabaseService
    ){}
    
    async getResourcesByResponsible(token:Token){
        const user = await this.authService.getUser(token);
        if(!user){
            throw new NotFoundException("Used cannot be found");
        }
        return await this.databaseService.searchResourcesByCollab(user);
    }

    async getResourcesAsImages(rsrc_id:number,token:Token):Promise<string>{
        //first, identity the user
        const user = await this.databaseService.findUser(token.userId,token.role);
        if(!user){
            throw new NotFoundException("User can't be found");
        }
        //second, check permits
        if(!user.permits.canAccess || !(user.permits as UserPermit).canVisualize){
            throw new UnauthorizedException("You don't have enough permits to execute this operation");
        }
        //now, get the resource object
        const rsrcObj = await this.databaseService.getResourceObject(rsrc_id);
        console.log(rsrcObj);
        if(!rsrcObj){
            throw new NotFoundException("Resource don't exist")
        }
        //register the activity
        this.databaseService.registerAccessActivity(user.id,rsrcObj.rsrc_id,'VISUALIZATION');
        //return an streamable reference for the object
        return rsrcObj.path;
    }

    async downloadResources(rsrc_id:number, token:Token):Promise<ReadStream>{
        const user = await this.authService.getUser(token);
        if(user == null){
            throw new UnauthorizedException("Cannot find user");
        }
        //check permits
        if(!(user.permits as UserPermit).canDownload){
            throw new UnauthorizedException("You can't perform this operation");
        }
        //get the resource object which have the file and the policies
        const resrc_obj = await this.databaseService.getResourceObject(rsrc_id);
        if(resrc_obj == null){
            throw new NotFoundException("Cannot find the resource object");
        }
        if(!resrc_obj.policies.canBeDownloaded){
            throw new UnauthorizedException("Download prohibited to this resource");
        }
        //get the appropiate path
        const fullPath = join(process.cwd(),resrc_obj.path);
        return createReadStream(fullPath);
    }

    async searchResource(searchResource:SearchResourceDto){
        return await this.databaseService.findResourceByCriteria(searchResource)
    }
    
    //Create and returns a resource reference, or throws an exception if not found
    async createResourceReference(id:number,token:Token):Promise<ResourceReference>{
    
        //First step: get the user (with some extra validation although jwtGuard made all the work way before this point)
        const user = await this.authService.getUser(token);
        if(user == null){
            throw new UnauthorizedException("Can't identify user");
        }
        //We have the user identified. Check if he has enough permits
        if(!(user.permits as UserPermit).canVisualize){
            throw new UnauthorizedException("You can't perform this operation");
        }
        //Now get the resource reference
        const rsrc_ref:ResourceReference | null = await this.databaseService.findResourceReference(id);
        if(rsrc_ref == null){
            throw new NotFoundException("Resource reference not found");
        }
        //we have both, now just register the activity
        this.databaseService.registerAccessActivity(user.id,rsrc_ref.rsrc_id,"RESOURCE_REF_ACCESS");
        //and return
        return rsrc_ref;
    }

}