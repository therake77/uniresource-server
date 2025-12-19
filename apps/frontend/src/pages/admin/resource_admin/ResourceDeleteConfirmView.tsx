/**
 * ResourceDeleteConfirmView Component
 * ------------------------------------
 * Vista de confirmación final para eliminar un recurso.
 * 
 * Ubicación: src/components/admin/resources/ResourceDeleteConfirmView.tsx
 * Se usa en: src/components/admin/ResourcesSection.tsx
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

interface ResourceDeleteConfirmViewProps {
  onBack: () => void;
  onConfirm: (email: string, password: string) => void;
}

const ResourceDeleteConfirmView = ({ onBack, onConfirm }: ResourceDeleteConfirmViewProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(email, password);
  };

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-foreground">Confirmar Eliminación</h2>

      {/* Card de confirmación */}
      <div className="flex justify-center mt-12">
        <div className="bg-muted/50 rounded-2xl p-8 w-full max-w-md space-y-6">
          <h3 className="text-xl font-semibold text-foreground text-center">
            Confirme la operación
          </h3>

          {/* Campo Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              placeholder="nombre@uni.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-primary/50 focus:border-primary"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Contraseña</label>
            <Input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-primary/50 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Botón confirmar */}
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleConfirm}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[250px]"
        >
          Confirmar eliminación
        </Button>
      </div>
    </div>
  );
};

export default ResourceDeleteConfirmView;
