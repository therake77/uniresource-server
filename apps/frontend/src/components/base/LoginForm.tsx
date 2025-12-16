
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GraduationCap } from "lucide-react";

const LoginForm = () => {
  // Hook de navegación
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    console.log("Hello");
    
    const res = await fetch("http://localhost:3000/api/auth/login",{
      method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        email : email,
        password : password,
        roleRequested : type
      }),
    })
    if(!res.ok){
      alert(`Error: ${(await res.json()).message}`)
      return;
    }
    const token = await res.text();
    localStorage.setItem('access_token',token);

    switch(type){
      case("USER"):{
        navigate("/user");
        break;
      }
      case("COLLAB"):{
        navigate("/collab");
        break;
      }
      case("ADMIN"):{
        navigate("/admin")
        break;
      }
      default:
        navigate("/user");
        break;
    }
    return;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8">
      {/* Logo institucional UNI */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-muted rounded-lg">
        <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border-2 border-primary shadow-md">
          <GraduationCap className="w-12 h-12 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">UNIVERSIDAD</span>
          <span className="text-lg font-bold text-foreground">NACIONAL DE</span>
          <span className="text-lg font-bold text-primary">INGENIERÍA</span>
        </div>
      </div>

      {/* Título de la sección */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Inicio de Sesión</h2>
        <p className="text-muted-foreground">
          Inicia sesión con tu cuenta <span className="font-semibold text-foreground">UNI</span>
        </p>
      </div>

      {/* Formulario de login */}
      <form className="space-y-5">
        {/* Campo de Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@uni.pe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-border focus:ring-primary"
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-medium">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 border-border focus:ring-primary"
          />
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 pt-4">
          {/* Botón principal - Inicia sesión */}
          <Button
            type="button"
            onClick={(e)=> handleSubmit(e,"USER")}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
          >
            Inicia sesión
          </Button>

          {/* Botón secundario - Colaborador */}
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "COLLAB")}
            className="w-full h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-lg"
          >
            Inicia sesión (colaborador)
          </Button>

          {/* Botón secundario - Administrador */}
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "ADMIN")}
            className="w-full h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium rounded-lg"
          >
            Inicia sesión (administrador)
          </Button>
        </div>
      </form>

      {/* Enlace a registro */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          ¿No tienes una cuenta? {" "}
          <Link to="/register" className="font-semibold text-foreground hover:text-primary transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
