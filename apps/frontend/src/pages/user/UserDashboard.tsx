import { useState } from "react";
import UserSidebar from "@/pages/user/UserSidebar";
import UserHeader from "@/pages/user/UserHeader";
import ResourcesSection from "@/pages/user/ResourcesSection";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("recursos");

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
    <div className="min-h-screen flex w-full bg-muted/30">
      <UserSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col">
        <UserHeader sectionTitle={sectionTitles[activeSection]} />

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
