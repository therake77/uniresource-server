import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { ResourceEntity } from "./model.rsrcEnt";
import { Type } from "class-transformer";

@Entity()
export class ResourceMetadataEntity{
    @PrimaryColumn()
    rsrc_id:number;
    
    @Column()
    name:string;

    @Column()
    type:string;

    @Column()
    @Type(()=>Date)
    publish_date:Date;
    
    @Column()
    @Type(()=>Date)
    upload_date:Date;

    @Column()
    course:string;
    
    @Column({nullable:true})
    semester:number;

    @Column({nullable:true})
    school:string;

    @Column({type:'text'})
    description:string;

    @OneToOne(()=>ResourceEntity,(rsrcEnt)=>(rsrcEnt.resourceMetadata),{onDelete:'CASCADE'})
    @JoinColumn({ name: 'rsrc_id'})
    rsrc_ent?:ResourceEntity;

}