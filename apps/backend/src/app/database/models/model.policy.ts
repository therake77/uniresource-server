import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { ResourceEntity } from "./model.rsrcEnt";

@Entity()
export class ResourcePolicy{
    @PrimaryColumn()
    rsrc_id?:number;

    @Column()
    canBeDownload:boolean;
    
    @Column()
    canBeIndexed:boolean;

    @OneToOne(()=>(ResourceEntity),(rsrEnt)=>(rsrEnt.policy))
    @JoinColumn({name:"rsrc_id"})
    rsrc_ent?:ResourceEntity;

}