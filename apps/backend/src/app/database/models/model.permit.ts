import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./model.role";
import { UserEntity } from "./model.user";

@Entity('permit')
export class PermitEntity{
    @PrimaryGeneratedColumn()
    permit_id:number;

    @Column()
    permit_name:string;
    
    @Column({type:'text'})
    description:string;

    @ManyToOne(()=>RoleEntity, (role:RoleEntity) => (role.permitsAllowed))
    @JoinColumn({name:'role_id'})
    role: RoleEntity;

    @ManyToMany(()=>UserEntity,(user)=>(user.permits))
    users:UserEntity[];

}