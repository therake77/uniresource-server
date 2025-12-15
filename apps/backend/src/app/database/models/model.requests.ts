import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { UserEntity } from "./model.user";
import { ResourceEntity } from "./model.rsrcEnt";


//important note: relationships of this table are not managed by typeorm, because it depends
//on the type that the row will hold
// or that is the intention, at least. 

@Entity('base_request')
@TableInheritance({column:{type:"varchar",name:"kind"}})
export class RequestEntity{
    @PrimaryGeneratedColumn()
    request_id:number;

    @Column({default:'PENDIENTE'})
    approved:string
}

@ChildEntity('resource_request')
export class ResourceRequestEntity extends RequestEntity{

    @ManyToOne(()=>UserEntity,(user)=>(user.requestsMade))
    @JoinColumn({name : "requestor_id"})
    requestor:UserEntity;
    
    @Column()
    request_type:string;

    @ManyToOne(()=>ResourceEntity,(rsrEnt)=>(rsrEnt.requestsAsAffected),{nullable: true})
    @JoinColumn({name: 'obj_affected_id'})
    object_affected?:ResourceEntity;

    @ManyToOne(()=>ResourceEntity,(rsrcEnt)=>(rsrcEnt.requestsAsAffecting),{nullable: true})
    @JoinColumn({name: 'obj_affecting_id'})
    object_affecting?:ResourceEntity;

}

@ChildEntity('user_request')
export class UserRequestEntity extends RequestEntity{

    @Column()
    request_type:string;

    @ManyToOne(()=>UserEntity,(user)=>(user.collaboratorRequests))
    @JoinColumn({name:'requestor_id'})
    requestor:UserEntity;
    
}