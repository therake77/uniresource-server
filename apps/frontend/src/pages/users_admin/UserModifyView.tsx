/**
 * UserModifyView Component
 * ------------------------
 * Pantalla para modificar permisos y roles de un usuario.
 * 
 * Se usa en: UsersSection.tsx (cuando se presiona "Modificar usuario")
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface UserModifyViewProps {
  user: UserData;
  onSave: (updatedUser: UserData) => void;
  onBack: () => void;
}

const UserModifyView = ({ user, onSave, onBack }: UserModifyViewProps) => {
  const [permisos, setPermisos] = useState(user.permisos);
  const [roles, setRoles] = useState(user.roles);

  const handleSave = () => {
    onSave({
      ...user,
      permisos,
      roles,
    });
  };

  return (
    <div className="space-y-6">
      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Panel de imagen */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Imagen</span>
          </div>
          <span className="text-sm text-muted-foreground mt-2">Imagen</span>
        </div>

        {/* Panel de modificación */}
        <div className="bg-muted/70 rounded-lg p-6 min-w-[400px]">
          <h3 className="text-xl font-semibold text-foreground mb-4">Modificar</h3>
          
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
              <div className="ml-8 mt-2 space-y-2">
                <div className="flex items-center justify-between max-w-xs">
                  <span>(Global) Acceso:</span>
                  <Select
                    value={permisos.acceso ? "si" : "no"}
                    onValueChange={(value) => 
                      setPermisos({ ...permisos, acceso: value === "si" })
                    }
                  >
                    <SelectTrigger className="w-20 h-8 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between max-w-xs">
                  <span>(Global) Descarga:</span>
                  <Select
                    value={permisos.descarga ? "si" : "no"}
                    onValueChange={(value) => 
                      setPermisos({ ...permisos, descarga: value === "si" })
                    }
                  >
                    <SelectTrigger className="w-20 h-8 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between max-w-xs">
                  <span>(Global) Visualización:</span>
                  <Select
                    value={permisos.visualizacion ? "si" : "no"}
                    onValueChange={(value) => 
                      setPermisos({ ...permisos, visualizacion: value === "si" })
                    }
                  >
                    <SelectTrigger className="w-20 h-8 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Si</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <span className="font-medium ml-4">Roles:</span>
              <div className="ml-8 mt-2 space-y-1">
                <div className="flex gap-4">
                  <span>Colaborador:</span>
                </div>
                <div className="flex gap-4">
                  <span>Responsable:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4 mt-8">
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[180px]"
          onClick={handleSave}
        >
          Guardar
        </Button>
      </div>

      {/* Botón volver */}
      <Button variant="outline" onClick={onBack} className="mt-4">
        ← Volver
      </Button>
    </div>
  );
};

export default UserModifyView;
