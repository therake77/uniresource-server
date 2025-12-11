import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class Metadata{
    @IsNotEmpty()
    name:string;
    
    @IsNotEmpty()
    type:string;

    @IsNotEmpty()
    @Type(()=>Date)
    publish_date:Date;

    @IsNotEmpty()
    course:string;

    @IsNumber()
    @IsNotEmpty()
    semester:number;

    @IsNotEmpty()
    school:string;

    @IsNotEmpty()
    description:string;
}

export class NewResourceDto{
    
    @IsNotEmpty()
    @Type(()=>(Metadata))
    metadata:Metadata;

    @IsNotEmpty()
    @IsBoolean()
    isDownloadable:boolean;

    @IsNotEmpty()
    authors:string[];
}

