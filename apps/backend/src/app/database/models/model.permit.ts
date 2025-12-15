import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./model.role";
import { UserEntity } from "./model.user";

@Entity('permit')
export class PermitEntity{
    @PrimaryGeneratedColumn()
    permit_id:number;

    @Column({unique:true})
    permit_name:string;
    
    @Column({type:'text'})
    description:string;

    @ManyToMany(()=>RoleEntity, (role:RoleEntity) => (role.permitsAllowed))
    @JoinTable()
    role: RoleEntity;

    @ManyToMany(()=>UserEntity,(user)=>(user.permits))
    users:UserEntity[];

}