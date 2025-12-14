/**
 * AdminHeader Component
 * ---------------------
 * Encabezado del panel de administración con:
 * - Título de la sección actual (izquierda)
 * - Logo UniResource y Facultad de Ciencias (derecha)
 * 
 * Ubicación: src/components/admin/AdminHeader.tsx
 * Se usa en: src/pages/AdminDashboard.tsx
*/

import { GraduationCap } from "lucide-react";

interface AdminHeaderProps {
  sectionTitle: string;
}

const AdminHeader = ({ sectionTitle }: AdminHeaderProps) => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Título de la sección actual */}
        <h1 className="text-2xl font-semibold text-foreground">
          {sectionTitle}
        </h1>

        {/* Logo y branding institucional */}
        <div className="flex items-center gap-4">
          {/* Título UniResource */}
          <span className="text-3xl font-bold text-primary italic tracking-wide">
            UniResource
          </span>

          {/* Separador vertical */}
          <div className="h-10 w-px bg-border" />

          {/* Logo Facultad de Ciencias */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Facultad de</span>
            <span className="text-lg font-bold text-primary">CIENCIAS</span>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-primary">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;