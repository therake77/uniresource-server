import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    public username:string;

    @Column()
    public email:string;

    @Column()
    public password:string;
    

}