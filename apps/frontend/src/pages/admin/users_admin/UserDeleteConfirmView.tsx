/**
 * UserDeleteConfirmView Component
 * --------------------------------
 * Pantalla de confirmación final de eliminación con email y contraseña.
 * 
 * Se usa en: UsersSection.tsx (después de presionar "Eliminar usuario" en UserDeleteView)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserDeleteConfirmViewProps {
  onConfirm: (email: string, password: string) => void;
  onBack: () => void;
}

const UserDeleteConfirmView = ({ onConfirm, onBack }: UserDeleteConfirmViewProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onConfirm(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Card de confirmación */}
      <div className="bg-muted/70 rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-foreground text-center mb-8">
          Confirme la operación
        </h2>

        <div className="space-y-6">
          {/* Campo Email */}
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
              className="bg-muted border-primary/50 focus:border-primary"
            />
          </div>

          {/* Campo Contraseña */}
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
              className="bg-muted border-primary/50 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Botón confirmar */}
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[220px] mt-8"
        onClick={handleSubmit}
      >
        Confirmar eliminación
      </Button>

      {/* Botón volver */}
      <Button variant="outline" onClick={onBack} className="mt-4">
        ← Volver
      </Button>
    </div>
  );
};

export default UserDeleteConfirmView;
