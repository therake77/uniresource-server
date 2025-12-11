import { IsIn, IsNotEmpty } from "class-validator";

export const requestTypes = [ 'COLLAB', 'UPDATE', 'UPLOAD', 'DELETE']

export class RequestDto{
    
    @IsNotEmpty()
    @IsIn(requestTypes)
    requestType:string


}