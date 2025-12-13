import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResourceMetadataEntity } from "./model.rsrcMeta";
import { ResourcePolicy } from "./model.policy";
import { AuthorEntity } from "./model.author";
import { UserEntity } from "./model.user";
import { AccessRegisterEntity } from "./accessRegister";

@Entity()
export class ResourceEntity{
    @PrimaryGeneratedColumn()
    rsrc_id:number;
    
    @Column()
    path:string;

    @OneToOne(
        ()=>(ResourceMetadataEntity),
        (metadata)=>(metadata.rsrc_ent),
        {cascade:true}
    )
    resourceMetadata:ResourceMetadataEntity;

    @OneToOne(()=>(ResourcePolicy),(policy)=>(policy.rsrc_ent))
    @JoinColumn()
    policy:ResourcePolicy;

    @ManyToMany(()=>(AuthorEntity),(author)=>(author.resources))
    @JoinTable()
    authors:AuthorEntity[];

    @ManyToOne(()=>(UserEntity),(user)=>(user.responsible_of))
    @JoinColumn({name: "policy_id"})
    responsible:UserEntity;

    @OneToMany(()=>AccessRegisterEntity,(activity)=>(activity.resourceAccessed))
    accessRegisterEntries?:AccessRegisterEntity[];
}