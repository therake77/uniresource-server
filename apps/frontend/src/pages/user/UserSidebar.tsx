import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const UserSidebar = ({ activeSection, onSectionChange }: UserSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "recursos", label: "Ver Recursos" },
    { id: "misrecursos", label: "Mis Recursos" },
    { id: "solicitudes", label: "Mis Solicitudes" },
    { id: "perfil", label: "Perfil" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-background border-r border-border flex flex-col">
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

      <div className="p-4 border-t border-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Usuario</p>
            <p className="text-xs text-muted-foreground">ID: usuario-demo</p>

            <Button variant="outline" size="sm" className="mt-2 w-full h-7 text-xs" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
