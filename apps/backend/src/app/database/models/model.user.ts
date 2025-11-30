import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { RoleEntity } from "./model.role";
import { PermitEntity } from "./model.permit";
import { ResourceEntity } from "./model.rsrcEnt";

@Entity('user')
export class UserEntity{

    @PrimaryGeneratedColumn()
    user_id:number;

    @Column()
    public username:string;

    @Column()
    public email:string;

    @Column()
    public password:string;

    @ManyToMany(() => RoleEntity,(rol)=>(rol.users))
    @JoinTable()
    roles: RoleEntity[];

    @ManyToMany(() => PermitEntity,(permit)=>(permit.users))
    @JoinTable()
    permits: PermitEntity[];

    @OneToMany(()=>ResourceEntity,(rsrcEnt)=>(rsrcEnt.responsible))
    responsible_of:ResourceEntity[];
}