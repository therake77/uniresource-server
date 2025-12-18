/**
 * UsersSection Component
 * ----------------------
 * Sección para visualizar y gestionar usuarios del sistema.
 * Incluye:
 * - Lista de usuarios con búsqueda
 * - Vista detallada de usuario
 * - Eliminación de usuario con confirmación
 * - Modificación de usuario
 * 
 * Ubicación: src/components/admin/UsersSection.tsx
 * Se usa en: src/pages/AdminDashboard.tsx (cuando activeSection === "usuarios")
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Componentes de vistas de usuario
// Se usan para mostrar diferentes pantallas según la acción del usuario
import UserDetailView from "@/pages/users_admin/UserDetailView";
import UserDeleteView from "@/pages/users_admin/UserDeleteView";
import UserDeleteConfirmView from "@/pages/users_admin/UserDeleteConfirmView";
import UserModifyView from "@/pages/users_admin/UserModifyView";

// Tipo de datos de usuario
interface UserData {
  id: number;
  codigo: string;
  email: string;
  nombre: string;
  info: string;
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

// Datos de ejemplo de usuarios
const mockUsers: UserData[] = [
  { 
    id: 1, 
    codigo: "USR001",
    email: "usuario1@uni.pe",
    nombre: "(Nombre)", 
    info: "Información extra",
    permisos: { acceso: true, descarga: false, visualizacion: true },
    roles: { colaborador: false, responsable: false }
  },
  { 
    id: 2, 
    codigo: "USR002",
    email: "usuario2@uni.pe",
    nombre: "(Nombre)", 
    info: "Información extra",
    permisos: { acceso: true, descarga: true, visualizacion: true },
    roles: { colaborador: true, responsable: false }
  },
  { 
    id: 3, 
    codigo: "USR003",
    email: "usuario3@uni.pe",
    nombre: "(Nombre)", 
    info: "Información extra",
    permisos: { acceso: false, descarga: false, visualizacion: true },
    roles: { colaborador: false, responsable: true }
  },
  { 
    id: 4, 
    codigo: "USR004",
    email: "usuario4@uni.pe",
    nombre: "(Nombre)", 
    info: "Información extra",
    permisos: { acceso: true, descarga: true, visualizacion: true },
    roles: { colaborador: true, responsable: true }
  },
  { 
    id: 5, 
    codigo: "USR005",
    email: "usuario5@uni.pe",
    nombre: "(Nombre)", 
    info: "Información extra",
    permisos: { acceso: true, descarga: false, visualizacion: false },
    roles: { colaborador: false, responsable: false }
  },
];

// Estados de la vista
type ViewState = "list" | "detail" | "delete" | "deleteConfirm" | "modify";

const UsersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteMotivo, setDeleteMotivo] = useState("");

  const handleSearch = () => {
    console.log("Buscando usuario:", searchTerm);
  };

  // Handlers para navegación entre vistas
  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setViewState("detail");
  };

  const handleModifyUser = () => {
    setViewState("modify");
  };

  const handleDeleteUser = () => {
    setViewState("delete");
  };

  const handleConfirmDelete = (motivo: string) => {
    setDeleteMotivo(motivo);
    setViewState("deleteConfirm");
  };

  const handleFinalDelete = (email: string, password: string) => {
    console.log("Eliminando usuario:", selectedUser?.id, "Motivo:", deleteMotivo, "Email:", email);
    // Aquí iría la lógica de eliminación real
    setViewState("list");
    setSelectedUser(null);
  };

  const handleSaveUser = (updatedUser: UserData) => {
    console.log("Guardando usuario:", updatedUser);
    // Aquí iría la lógica de guardado real
    setViewState("list");
    setSelectedUser(null);
  };

  const handleBackToList = () => {
    setViewState("list");
    setSelectedUser(null);
  };

  const handleBackToDetail = () => {
    setViewState("detail");
  };

  const handleBackToDelete = () => {
    setViewState("delete");
  };

  // Renderiza la vista según el estado actual
  if (viewState === "detail" && selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        onModify={handleModifyUser}
        onDelete={handleDeleteUser}
        onBack={handleBackToList}
      />
    );
  }

  if (viewState === "delete" && selectedUser) {
    return (
      <UserDeleteView
        user={selectedUser}
        onConfirmDelete={handleConfirmDelete}
        onBack={handleBackToDetail}
      />
    );
  }

  if (viewState === "deleteConfirm" && selectedUser) {
    return (
      <UserDeleteConfirmView
        onConfirm={handleFinalDelete}
        onBack={handleBackToDelete}
      />
    );
  }

  if (viewState === "modify" && selectedUser) {
    return (
      <UserModifyView
        user={selectedUser}
        onSave={handleSaveUser}
        onBack={handleBackToDetail}
      />
    );
  }

  // Vista de lista (por defecto)
  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium whitespace-nowrap">Nombre:</span>
          <Input
            type="text"
            placeholder="Palabra clave"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-background"
          />
          <div className="flex-1" />
          <Button 
            variant="secondary" 
            className="bg-foreground text-background hover:bg-foreground/90"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        {mockUsers.map((user) => (
          <UserCard 
            key={user.id} 
            nombre={user.nombre} 
            info={user.info}
            onView={() => handleViewUser(user)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * UserCard Component
 * ------------------
 * Tarjeta individual para mostrar información básica de un usuario.
 * 
 * Se usa en: UsersSection (este archivo) - en la vista de lista
 */
interface UserCardProps {
  nombre: string;
  info: string;
  onView: () => void;
}

const UserCard = ({ nombre, info, onView }: UserCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-foreground">{nombre}</h3>
        <p className="text-sm text-muted-foreground">{info}</p>
      </div>
      <Button variant="outline" className="min-w-[80px]" onClick={onView}>
        Ver
      </Button>
    </div>
  );
};

export default UsersSection;
