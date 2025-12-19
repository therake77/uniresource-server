import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ResourceMetadataEntity } from "./model.rsrcMeta";
import { ResourcePolicy } from "./model.policy";
import { AuthorEntity } from "./model.author";
import { UserEntity } from "./model.user";
import { AccessRegisterEntity } from "./accessRegister";
import { ResourceRequestEntity } from "./model.requests";

@Entity()
export class ResourceEntity{
    @PrimaryGeneratedColumn()
    rsrc_id:number;
    
    @Column({unique: true})
    path:string;

    @OneToOne(
        ()=>(ResourceMetadataEntity),
        (metadata)=>(metadata.rsrc_ent),
        {cascade:true}
    )
    resourceMetadata:ResourceMetadataEntity;

    @OneToOne(()=>(ResourcePolicy),(policy)=>(policy.rsrc_ent),{cascade:true})
    policy:ResourcePolicy;

    @ManyToMany(()=>(AuthorEntity),(author)=>(author.resources))
    @JoinTable()
    authors:AuthorEntity[];

    @ManyToOne(()=>(UserEntity),(user)=>(user.responsible_of))
    @JoinColumn({name: "policy_id"})
    responsible:UserEntity;

    @OneToMany(()=>AccessRegisterEntity,(activity)=>(activity.resourceAccessed))
    accessRegisterEntries?:AccessRegisterEntity[];

    @OneToMany(()=>ResourceRequestEntity,(request)=>(request.object_affected),{nullable: true})
    requestsAsAffected?: ResourceRequestEntity[];

    @OneToMany(()=>ResourceRequestEntity,(request)=>(request.object_affecting),{nullable: true})
    requestsAsAffecting?: ResourceRequestEntity[];

}