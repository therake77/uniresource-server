/**
 * UserDetailView Component
 * ------------------------
 * Pantalla de detalle de un usuario con imagen, resumen y botones de acción.
 * 
 * Se usa en: UsersSection.tsx (cuando se presiona "Ver" en un usuario)
 */

import { Button } from "@/components/ui/button";

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

interface UserDetailViewProps {
  user: UserData;
  onModify: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const UserDetailView = ({ user, onModify, onDelete, onBack }: UserDetailViewProps) => {
  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Volver a lista
      </Button>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Panel de imagen */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Imagen</span>
          </div>
          <span className="text-sm text-muted-foreground mt-2">Imagen</span>
        </div>

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
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center gap-4 mt-8">
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[180px]"
          onClick={onModify}
        >
          Modificar usuario
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[180px]"
          onClick={onDelete}
        >
          Eliminar usuario
        </Button>
      </div>
    </div>
  );
};

export default UserDetailView;
