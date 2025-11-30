import { Type } from "class-transformer";

export class ResourceReference{
    rsrc_id:number
    name:string;
    type:string;
    
    @Type(()=>Date)
    publish_date:Date;
    
    @Type(()=>Date)
    upload_date:Date;
    course:string;
    semester:number;
    school:string;
    description:string;
    authors:string[]
}