import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ResourceMetadataEntity } from "./model.rsrcMeta";
import { ResourceEntity } from "./model.rsrcEnt";

@Entity()
export class AuthorEntity{
    @PrimaryGeneratedColumn()
    author_id:number;

    @Column()
    author_name:string;

    @ManyToMany(()=>(ResourceEntity),(rsrc_ent)=>(rsrc_ent.authors))
    resources:ResourceMetadataEntity[];
}