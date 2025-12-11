import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResourceEntity } from "./model.rsrcEnt";

@Entity()
export class AccessRegisterEntity{
    @PrimaryGeneratedColumn()
    activity_id: number;

    @ManyToOne(()=>(ResourceEntity),(rsrcEnt)=>(rsrcEnt.accessRegisterEntries))
    @JoinColumn({name:'rsrc_id'})
    resourceAccessed:ResourceEntity;

    @Column()
    accessType:string;

}