import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResourceMetadataEntity } from "./model.rsrcMeta";
import { ResourcePolicy } from "./model.policy";
import { AuthorEntity } from "./model.author";
import { UserEntity } from "./model.user";

@Entity()
export class ResourceEntity{
    @PrimaryGeneratedColumn()
    rsrc_id:number;
    
    @Column()
    path:string;

    @OneToOne(()=>(ResourceMetadataEntity),(metadata)=>(metadata.rsrc_ent))
    resourceMetadata:ResourceMetadataEntity;

    @OneToOne(()=>(ResourcePolicy),(policy)=>(policy.rsrc_ent))
    policy:ResourcePolicy;

    @ManyToMany(()=>(AuthorEntity),(author)=>(author.resources))
    @JoinTable()
    authors:AuthorEntity[];

    @ManyToOne(()=>(UserEntity),(user)=>(user.responsible_of))
    @JoinColumn()
    responsible:UserEntity;

}