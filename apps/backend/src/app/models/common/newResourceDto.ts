import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Policy } from "./policy";
import { User } from "./user";

export class NewMetadataDto{
    @IsNotEmpty()
    name:string;
    
    @IsNotEmpty()
    type:string;

    @IsNotEmpty()
    @Type(()=>Date)
    @IsDate()
    publish_date:Date;

    @IsNotEmpty()
    course:string;
    
    @IsNotEmpty()
    @Type(()=>Number)
    @IsNumber()
    semester:number;

    @IsNotEmpty()
    school:string;

    @IsNotEmpty()
    description:string;
}

export class NewResourceDto{
    
    @ValidateNested()
    @IsNotEmpty()
    @Type(()=>(NewMetadataDto))
    metadata:NewMetadataDto;

    @IsNotEmpty()
    @IsBoolean()
    @Type(()=>Boolean)
    isDownloadable:boolean;

    @IsNotEmpty()
    @IsArray()
    @IsString({each:true})
    authors:string[];
}

export class NewMetadata{
    name:string;
    type:string;
    publish_date:Date;
    upload_date:Date;
    course:string;
    semester:number;
    school:string;
    description:string;
}

export class NewResource{
    path:string;
    resourceMetadata:NewMetadata;
    policy:Policy
    authors:string[]
    responsible:User
}

