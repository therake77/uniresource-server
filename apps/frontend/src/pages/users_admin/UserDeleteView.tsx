/**
 * UserDeleteView Component
 * ------------------------
 * Pantalla para confirmar eliminación de usuario con resumen y campo de motivo.
 * 
 * Se usa en: UsersSection.tsx (cuando se presiona "Eliminar usuario")
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UserData {
  id: number;
  codigo: string;
  email: string;
  permisos: {
    acceso: boolean;
    descarga: boolean;
    visualizacion: boolean;
  };
  roles: {
    colaborador: boolean;
    responsable: boolean;
  };
}

interface UserDeleteViewProps {
  user: UserData;
  onConfirmDelete: (motivo: string) => void;
  onBack: () => void;
}

const UserDeleteView = ({ user, onConfirmDelete, onBack }: UserDeleteViewProps) => {
  const [motivo, setMotivo] = useState("");

  return (
    <div className="space-y-6">
      {/* Subtítulo */}
      <p className="text-foreground text-lg">Está seguro de eliminar este recurso?</p>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Panel de resumen */}
        <div className="bg-muted/70 rounded-lg p-6 min-w-[350px]">
          <h3 className="text-xl font-semibold text-foreground mb-4">Resumen:</h3>
          
          <div className="space-y-3 text-foreground">
            <div className="flex gap-2">
              <span className="font-medium ml-4">Código:</span>
              <span>{user.codigo}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium ml-4">Email:</span>
              <span>{user.email}</span>
            </div>
            
            <div>
              <span className="font-medium ml-4">Permisos:</span>
              <div className="ml-8 mt-2 space-y-1">
                <div className="flex justify-between max-w-xs">
                  <span>(Global) Acceso:</span>
                  <span>{user.permisos.acceso ? "Si" : "No"}</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>(Global) Descarga:</span>
                  <span>{user.permisos.descarga ? "Si" : "No"}</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>(Global) Visualización:</span>
                  <span>{user.permisos.visualizacion ? "Si" : "No"}</span>
                </div>
              </div>
            </div>
            
            <div>
              <span className="font-medium ml-4">Roles:</span>
              <div className="ml-8 mt-2 space-y-1">
                <div className="flex gap-4">
                  <span>Colaborador:</span>
                  <span>{user.roles.colaborador ? "Si" : "No"}</span>
                </div>
                <div className="flex gap-4">
                  <span>Responsable:</span>
                  <span>{user.roles.responsable ? "Si" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de motivo */}
        <div className="flex-1 space-y-4">
          <p className="text-foreground">Ingrese el motivo de la eliminación</p>
          <Textarea
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="min-h-[150px] bg-muted/70 border-border"
          />
          
          <div className="flex justify-end mt-4">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[180px]"
              onClick={() => onConfirmDelete(motivo)}
            >
              Eliminar usuario
            </Button>
          </div>
        </div>
      </div>

      {/* Botón volver */}
      <Button variant="outline" onClick={onBack} className="mt-4">
        ← Volver
      </Button>
    </div>
  );
};

export default UserDeleteView;
