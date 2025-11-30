import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { ResourceEntity } from "./model.rsrcEnt";

@Entity()
export class ResourceMetadataEntity{
    @PrimaryColumn()
    rsrc_id:number;
    
    @Column()
    name:string;

    @Column()
    type:string;

    @Column()
    publish_date:Date;
    
    @Column()
    upload_date:Date;
    
    @Column({nullable:true})
    semester:number;

    @Column({nullable:true})
    school:string;

    @Column({type:'text'})
    description:string;

    @OneToOne(()=>ResourceEntity,(rsrcEnt)=>(rsrcEnt.resourceMetadata))
    @JoinColumn({ name: 'rsrc_id'})
    rsrc_ent:ResourceEntity;

}