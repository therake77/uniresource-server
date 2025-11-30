import { IsDate } from "class-validator";

export class SearchResourceDto{
    name?:string;
    
    type?:string;

    @IsDate()
    dateOfPublish?:Date;

    school?:string;

    semester?:number;

    authors?:string[];

    course?:string;

}