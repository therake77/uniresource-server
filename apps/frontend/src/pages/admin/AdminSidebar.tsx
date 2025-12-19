import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserId(decoded.userId || null);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Opciones del menú lateral
  const menuItems = [
    { id: "solicitudes", label: "Revisar solicitudes" }
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-background border-r border-border flex flex-col">
      {/* Menú de navegación */}
      <nav className="flex-1 pt-8 px-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start mb-2 h-12 text-base font-medium rounded-none border-l-4 ${
              activeSection === item.id
                ? "border-l-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "border-l-primary bg-primary/90 text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Información del administrador */}
      <div className="p-4 border-t border-border">
        <div className="flex items-start gap-3">
          {/* Icono de usuario */}
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
          
          {/* Datos del administrador */}
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Administrador</p>
            <p className="text-xs text-muted-foreground">ID: {userId || "..."}</p>
            
            {/* Botón Salir */}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full h-7 text-xs"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;