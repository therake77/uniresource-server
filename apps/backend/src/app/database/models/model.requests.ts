import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


//important note: relationships of this table are not managed by typeorm, because it depends
//on the type that the row will hold
// or that is the intention, at least. 

@Entity()
export class RequestEntity{
    @PrimaryGeneratedColumn()
    request_id:number;

    @Column()
    request_type:string;

    @Column()
    object_affected:number;

    @Column()
    object_affecting:number;

 }