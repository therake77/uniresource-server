import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResourceEntity } from "./model.rsrcEnt";
import { UserEntity } from "./model.user";

@Entity()
export class AccessRegisterEntity{
    @PrimaryGeneratedColumn()
    activity_id: number;

    @ManyToOne(()=>(ResourceEntity),(rsrcEnt)=>(rsrcEnt.accessRegisterEntries))
    @JoinColumn({name:'rsrc_id'})
    resourceAccessed:ResourceEntity;

    @ManyToOne(()=>UserEntity,(user)=>(user.hasAccessedTo))
    @JoinColumn({name : 'user'})
    accessedBy:UserEntity;

    @Column()
    accessType:string;

}