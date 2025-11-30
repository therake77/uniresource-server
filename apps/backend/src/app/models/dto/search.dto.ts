import { IsDate, IsNotEmpty } from "class-validator";

export class SearchDto{
    
    @IsNotEmpty()
    title:string;

    type?:string;

    @IsDate()
    dateOfPublish?:Date;
    
    authors?:string[];

    semester:number;
    
    school:string;
}