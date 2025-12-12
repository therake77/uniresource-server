import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./model.user";


//important note: relationships of this table are not managed by typeorm, because it depends
//on the type that the row will hold
// or that is the intention, at least. 

@Entity('request')
export class RequestEntity{
    @PrimaryGeneratedColumn()
    request_id:number;

    @ManyToOne(()=>UserEntity,(user)=>(user.requestsMade))
    requestor:UserEntity;
    
    @Column()
    request_type:string;

    @Column({ nullable : true })
    object_affected:number;

    @Column({ nullable : true })
    object_affecting:number;


 }