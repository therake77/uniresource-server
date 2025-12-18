import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const payload = {
        username : nombre,
        email : email,
        password : password
    }
    const res = await fetch("http://localhost:3000/api/auth/register",
        {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(payload)
        }
    )
    if(!res.ok){
        alert(`Error: ${(await res.json()).message}`);
        return;
    }
    // Placeholder: the user will replace with real registration logic
    console.log("Register data:", { nombre, email });
    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8 p-4 bg-muted rounded-lg">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-2 border-primary">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">UNIVERSIDAD</span>
          <span className="text-lg font-bold text-foreground">NACIONAL DE</span>
          <span className="text-lg font-bold text-primary">INGENIERÍA</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Registro de Usuario</h2>
        <p className="text-muted-foreground">Crea tu cuenta para acceder a UniResource.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-foreground font-medium">Username</Label>
          <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="h-11 border-border focus:ring-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border-border focus:ring-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-medium">Contraseña</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 border-border focus:ring-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm" className="text-foreground font-medium">Confirmar contraseña</Label>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 border-border focus:ring-primary" />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg">Crear cuenta</Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
