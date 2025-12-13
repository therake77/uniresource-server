import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AuthService } from "../auth/auth.service";
import { Token } from "../models/common/token";
import { NewMetadata, NewResource, NewResourceDto } from "../models/common/newResourceDto";
import { ColabPermits } from "../models/common/permits";
import { RequestObject } from "../models/common/requestDto";
import { Role } from "../models/common/roles";

@Injectable()
export class RequestService{
    constructor(
        private readonly databaseService:DatabaseService,
        private readonly authService:AuthService
    ){}

    async getRequestsOfUser(token:Token):Promise<RequestObject[]>{
        const user = await this.authService.getUser(token);
        if(!user){
            throw new NotFoundException("User cannot be found");
        }
        return this.databaseService.getRequestsByCollab(user);
    }

    async requestUpload(uploadDate:Date, filename:string,newResourceDto:NewResourceDto,token:Token){
        console.log(newResourceDto);
        const userFound = await this.authService.getUser(token);
        if(!userFound){
            throw new NotFoundException("User can't be identified")
        }
        if(!((userFound.permits) instanceof ColabPermits) || !(userFound.permits as ColabPermits).canUpload){
            throw new UnauthorizedException("You can't perform this operation");
        }

        const providedMetadata = newResourceDto.metadata;
        const formattedMetadata:NewMetadata = {
            name : providedMetadata.name,
            type : providedMetadata.type,
            publish_date : providedMetadata.publish_date,
            upload_date : uploadDate,
            course : providedMetadata.course,
            semester : providedMetadata.semester,
            school : providedMetadata.school,
            description : providedMetadata.description
        }

        const newRsrc:NewResource = {
            path: filename,
            resourceMetadata : formattedMetadata,
            policy:{
                canBeDownloaded : newResourceDto.isDownloadable,
                canBeIndexed : false
            }, 
            authors : newResourceDto.authors,
            responsible : userFound
        }

        const request:RequestObject = {
            requestType: RequestObject.uploadRequest,
            requestor: userFound,
            object_affecting: newRsrc
        }

        return await this.databaseService.saveRequest(request);
    }

    async requestUpdate(requestDate:Date,filename:string,upd_rsrc:NewResourceDto,toUpdateRsrc:number,token:Token){
        //first, identitfy and check permits of user requesting
        const userFound = await this.authService.getUser(token);
        if(!userFound){
            throw new NotFoundException("User can't be identified")
        }
        if(!((userFound.permits) instanceof ColabPermits) || !(userFound.permits as ColabPermits).canUpload){
            throw new UnauthorizedException("You can't perform this operation");
        }
        //second, identify the resource to update and check if the user is the responsible
        const resourceToUpdate = await this.databaseService.getResourceObject(toUpdateRsrc);
        if(!resourceToUpdate){
            throw new NotFoundException("Cannot found specified resource");
        }

        if(resourceToUpdate.rsrc_id != userFound.id){
            throw new UnauthorizedException("You are not responsible from this resource");
        }
        
        //now, save the request
        const newResource:NewResource = {
            path : filename,
            resourceMetadata : {
                name: upd_rsrc.metadata.name,
                type : upd_rsrc.metadata.type,
                publish_date : upd_rsrc.metadata.publish_date,
                upload_date : requestDate,
                course : upd_rsrc.metadata.course,
                semester : upd_rsrc.metadata.semester,
                school : upd_rsrc.metadata.school,
                description : upd_rsrc.metadata.description
            },
            policy : {
                canBeDownloaded : upd_rsrc.isDownloadable,
                canBeIndexed : false
            },
            authors : upd_rsrc.authors,
            responsible : userFound
        }

        this.databaseService.saveRequest({
            requestor : userFound,
            requestType : RequestObject.updateRequest,
            object_affected : resourceToUpdate,
            object_affecting : newResource
        })
    }

    async requestDeletion(id:number,token:Token){
        //first identify the user
        const userFound = await this.authService.getUser(token);
        if(!userFound){
            throw new NotFoundException("User cannot be identified");
        }
        if(!((userFound.permits) instanceof ColabPermits)){
            throw new UnauthorizedException("You are not collaborator");
        }
        const resourceFound = await this.databaseService.getResourceObject(id);
        if(!resourceFound){
            throw new NotFoundException("Cannot found the specified resource");
        }

        //construct the request object
        return await this.databaseService.saveRequest({
            requestor : userFound,
            requestType : RequestObject.deleteRequest,
            object_affected : resourceFound,
        })
    }

    async requestCollaboration(token:Token){
        //check if user exists, and if he has already a collaboration role
        const user = await this.databaseService.findUser(token.userId,token.role);
        const flagUser = await this.databaseService.findUser(token.userId,Role.COLLAB);
        if(!user){
            throw new NotFoundException("User not found");
        }
        
        if(flagUser){
            throw new UnauthorizedException("User already has a collaborator role");
        }

        if(!((user.permits) instanceof ColabPermits)){
            throw new UnauthorizedException("You are not a collaborator");
        }
        //create and save the request
        return await this.databaseService.saveRequest({
            requestType:RequestObject.collabRequest,
            requestor: user,
            object_affected: user.id
        })
    }

    //backdoor
    async directUploadResource(newResource:{date:Date;filename:string,extra:NewResourceDto},token:Token){
        console.log(newResource);
        const userFound = await this.authService.getUser(token);
        if(!userFound){
            throw new NotFoundException("User can't be identified")
        }
        await this.databaseService.saveResource(newResource,userFound);
    }

}