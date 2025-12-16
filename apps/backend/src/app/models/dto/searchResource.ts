import { Type } from "class-transformer";
import { IsDate, IsEmpty, IsOptional } from "class-validator";

export class SearchResourceDto{
    name?:string;
    
    type?:string;

    @IsDate({})
    @IsOptional()
    @Type(()=>Date)
    dateOfPublish?:Date;

    school?:string;

    semester?:number;

    authors?:string[];

    course?:string;

}