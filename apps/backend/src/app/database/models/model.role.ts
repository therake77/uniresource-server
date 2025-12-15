import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermitEntity } from "./model.permit";
import { UserEntity } from "./model.user";

@Entity('role')
export class RoleEntity{
    @PrimaryGeneratedColumn()
    role_id:number;

    @Column({unique:true})
    role_name:string;
    
    @Column({type:'text'})
    description:string;

    @ManyToMany(()=>PermitEntity, (permit:PermitEntity) => (permit.role))
    permitsAllowed: PermitEntity[];

    @ManyToMany(()=>UserEntity,(user)=>(user.roles))
    users:UserEntity[];
    
}