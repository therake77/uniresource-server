export class Role{
    public static readonly USER = "user";
    public static readonly ADMIN = "admin";
    public static readonly COLAB = "colaborator"; 
    
    public readonly name:string
    
    private constructor(name:string){
        this.name = name
    }

    static createUserRole(){
        return new Role(Role.USER)
    }

    static createAdminRole(){
        return new Role(Role.ADMIN)
    }

    static createColabRole(){
        return new Role(Role.COLAB)
    }
}
