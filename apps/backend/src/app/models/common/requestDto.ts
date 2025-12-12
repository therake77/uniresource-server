import { User } from "./user";

export class RequestObject{

    static readonly collabRequest:string = 'COLLAB';
    static readonly updateRequest:string = 'UPDATE';
    static readonly uploadRequest:string = 'UPLOAD';
    static readonly deleteRequest:string = 'DELETE';

    /*
    some rules:
    requestType = COLLAB then:
        object_affected = user_id. Note: you should check if he has already a collab role
    requestType = UPDATE then:
        object_affected = id of ResourceObject object going to be updated
        object_affecting = ResourceObject object with index and download policy set to false. When accepted, the row should be removed, and its contents
        would emplace the corresponding fields of the object pointed by object_affected (stored in the requests table)
    requestType = UPLOAD then:
        object_affecting = ResourceObject,ResourceMetadata,Authors, with all the information
    requestType = DELETE then:
        object_affected = number of the resource_id

    */
    requestType:string;

    requestor:User;

    object_affected?:any;
    
    object_affecting?:any;

}