import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    public username:string;

    @Column()
    public email:string;

    @Column()
    public password:string;
    
}