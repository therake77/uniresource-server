/**
 * AdminDashboard Page
 * -------------------
 * Página principal del panel de administración que integra:
 * - AdminSidebar: Barra lateral con navegación y datos del admin
 * - AdminHeader: Encabezado con título de sección y branding
 * - ResourcesSection: Contenido de la sección "Ver Recursos"
 * 
 * Estructura del layout:
 * ┌─────────────┬────────────────────────────────┐
 * │             │         AdminHeader            │
 * │   Admin     ├────────────────────────────────┤
 * │   Sidebar   │                                │
 * │             │      Contenido (Resources)     │
 * │             │                                │
 * └─────────────┴────────────────────────────────┘
 * 
 * Ubicación: src/pages/AdminDashboard.tsx
 * Se usa en: src/App.tsx (ruta /admin)
 */

import { useState } from "react";
import AdminSidebar from "@/pages/admin/AdminSidebar";
import AdminHeader from "@/pages/admin/AdminHeader";
import ResourcesSection from "@/pages/admin/ResourcesSection";
import AdminRequestSection from "@/pages/admin/sections/AdminRequestSection";

const AdminDashboard = () => {
  // Estado para controlar la sección activa del sidebar
  const [activeSection, setActiveSection] = useState("recursos");

  // Mapeo de secciones a títulos
  const sectionTitles: Record<string, string> = {
    recursos: "Ver Recursos",
    usuarios: "Ver Usuarios",
    solicitudes: "Revisar solicitudes",
    mantenimiento: "Mantenimiento",
  };

  // Renderiza el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "recursos":
        return <ResourcesSection />;
      case "usuarios":
        return (
          <div className="text-center text-muted-foreground py-12">
            Sección de usuarios en desarrollo...
          </div>
        );
      case "solicitudes":
        return <AdminRequestSection />;
      case "mantenimiento":
        return (
          <div className="text-center text-muted-foreground py-12">
            Sección de mantenimiento en desarrollo...
          </div>
        );
      default:
        return <ResourcesSection />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      {/* Sidebar - Barra lateral de navegación */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header - Encabezado con título y branding */}
        <AdminHeader sectionTitle={sectionTitles[activeSection]} />

        {/* Área de contenido */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;