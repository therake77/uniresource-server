import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { RoleEntity } from "./model.role";
import { PermitEntity } from "./model.permit";
import { ResourceEntity } from "./model.rsrcEnt";
import { AccessRegisterEntity } from "./accessRegister";
import { ResourceRequestEntity, UserRequestEntity } from "./model.requests";

@Entity('user_entity')
@Unique(['email'])
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

    @OneToMany(()=>AccessRegisterEntity,(registerEntry)=>(registerEntry.accessedBy),{cascade: true,onDelete: 'CASCADE'})
    hasAccessedTo:AccessRegisterEntity[];

    @OneToMany(()=>UserRequestEntity,(request)=>(request.requestor),{cascade: true,onDelete: 'CASCADE'})
    collaboratorRequests:UserRequestEntity[]

    @OneToMany(()=>ResourceRequestEntity,(request)=>(request.requestor),{cascade: true,onDelete: 'CASCADE'})
    requestsMade:ResourceRequestEntity[]
}