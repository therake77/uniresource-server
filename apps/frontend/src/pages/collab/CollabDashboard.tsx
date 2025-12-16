import { useState } from "react";
import CollabSidebar from "@/pages/collab/CollabSidebar";
import CollabHeader from "@/pages/collab/CollabHeader";
import ResourcesSection from "@/pages/user/ResourcesSection";
import UploadSection from "./sections/UploadSection";
import MyRequestsSection from "./sections/MyRequestsSection";
import MyResourcesSection from "./sections/MyResourcesSection";

const CollabDashboard = () => {
  const [activeSection, setActiveSection] = useState("recursos");

  const sectionTitles: Record<string, string> = {
    recursos: "Mis recursos",
    subida: "Solicitar subida de recurso",
    solicitudes: "Ver mis solicitudes",
  };

  const renderContent = () => {
    switch (activeSection) {
        case "recursos":
            return <MyResourcesSection />;
        case "subida":
            return <UploadSection />;
        case "solicitudes":
            return <MyRequestsSection />;
        default:
            return (
            <div className="text-center text-muted-foreground py-12">Error...</div>
            );
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      <CollabSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <CollabHeader sectionTitle={sectionTitles[activeSection]} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CollabDashboard;
