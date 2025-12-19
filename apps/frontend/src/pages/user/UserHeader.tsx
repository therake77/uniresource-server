import { GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserHeaderProps {
  sectionTitle: string;
}

const UserHeader = ({ sectionTitle }: UserHeaderProps) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) setUserId(id);
  }, []);

  const handleRequestCollaborator = () => {
    // TODO: implement request collaborator
    alert("Request collaborator functionality to be implemented");
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate("/");
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">{sectionTitle}</h1>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary italic tracking-wide">
            UniResource
          </span>

          <div className="h-10 w-px bg-border" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Facultad de</span>
            <span className="text-lg font-bold text-primary">CIENCIAS</span>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="h-10 w-px bg-border" />

          <div className="flex items-center gap-3 bg-white border border-border rounded-lg p-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-foreground text-sm">Usuario</p>
              <p className="text-xs text-muted-foreground">ID: {userId || "usuario-demo"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRequestCollaborator}>
              Request Collaborator
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
