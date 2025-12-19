import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchResourceDto{

    @IsString()
    @IsOptional()
    name?:string;
    
    @IsString()
    @IsOptional()
    type?:string;

    @IsDate()
    @IsOptional()
    @Type(()=>Date)
    dateOfPublish?:Date;

    @IsString()
    @IsOptional()
    school?:string;

    @IsNumber()
    @IsOptional()
    semester?:number;

    @IsArray()
    @IsOptional()
    authors?:string[];

    @IsString()
    @IsOptional()
    course?:string;

}