import { useState } from "react";
import UserHeader from "@/pages/user/UserHeader";
import ResourcesSection from "@/pages/user/ResourcesSection";

const UserDashboard = () => {
  const [activeSection] = useState("recursos");

  const sectionTitles: Record<string, string> = {
    recursos: "Ver Recursos",
    misrecursos: "Mis Recursos",
    solicitudes: "Mis Solicitudes",
    perfil: "Perfil",
  };

  const renderContent = () => {
    switch (activeSection) {
      case "recursos":
        return <ResourcesSection />;
      default:
        return (
          <div className="text-center text-muted-foreground py-12">
            Sección en desarrollo...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-muted/30">
      <UserHeader sectionTitle={sectionTitles[activeSection]} />

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default UserDashboard;
