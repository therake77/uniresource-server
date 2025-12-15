import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Token } from "../models/common/token";
import { AuthService } from "../auth/auth.service";
import { AdminPermits } from "../models/common/permits";
import { DatabaseService } from "../database/database.service";
import { ResourceRequestEntity, UserRequestEntity } from "../database/models/model.requests";
import { Role } from "../models/common/roles";
import { RequestObject } from "../models/common/requestDto";

@Injectable()
export class AdminService{
    constructor(
        private readonly authService:AuthService,
        private readonly databaseService:DatabaseService
    ){}

    async getRequests(token : Token){
        //first, check the user
        const admin = await this.authService.getUser(token);
        if(!admin){
            throw new NotFoundException("Cannot identify admin");
        }
        if(!((admin.permits) instanceof AdminPermits)){
            throw new UnauthorizedException("You are not an admin");
        } 
        //return the requests
        return await this.databaseService.getRequests();
    }

    async approveRequest(token:Token, requestId:number){
        const admin = await this.authService.getUser(token);
        if(!admin){
            throw new NotFoundException("Cannot identify admin");
        }
        if(!((admin.permits) instanceof AdminPermits)){
            throw new UnauthorizedException("You are not an admin");
        }
        const request = await this.databaseService.getRequest(requestId);
        if(request.approved == 'DENEGADO'){
            throw new UnauthorizedException("That request was denied");
        }
        if(request instanceof UserRequestEntity){
            this.databaseService.addRoleToUser(request.requestor.user_id,Role.COLLAB)
        }else if(request instanceof ResourceRequestEntity){
            if(request.request_type === RequestObject.uploadRequest){
                this.databaseService.uploadResource(request.object_affecting!.rsrc_id)
            }else if(request.request_type === RequestObject.updateRequest){
                throw new BadRequestException("Not implemented")
            }else if(request.request_type === RequestObject.deleteRequest){
                this.databaseService.deleteResource(request.object_affected!.rsrc_id)
            }else{
                throw new InternalServerErrorException("Error: Request type cannot be recognized")
            }
        }else{
            throw new InternalServerErrorException("Error getting the result: Request Object is a base class and cannot be managed")
        }
    }

    async denyRequest(token:Token, requestId:number){
        const admin = await this.authService.getUser(token);
        if(!admin){
            throw new NotFoundException("Cannot identify admin");
        }
        if(!((admin.permits) instanceof AdminPermits)){
            throw new UnauthorizedException("You are not an admin");
        }
        await this.databaseService.denyRequest(requestId);
    }

}