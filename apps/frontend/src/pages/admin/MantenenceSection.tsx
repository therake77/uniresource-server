/**
 * MaintenanceSection Component
 * ----------------------------
 * Sección de mantenimiento del sistema con:
 * - Gestión de respaldos
 * - Parámetros globales (tipos de archivo permitidos, tamaño máximo)
 * - Panel de métricas (usuarios, plataforma, repositorio)
 * 
 * Ubicación: src/components/admin/MaintenanceSection.tsx
 * Se usa en: src/pages/AdminDashboard.tsx (cuando activeSection === "mantenimiento")
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Datos de ejemplo de respaldos
const mockBackups = [
  { id: 1, hash: "f6cac4638878f6ba9ac0075e5be32a42", fecha: "", adminId: "" },
  { id: 2, hash: "f6cac4638878f6ba9ac0075e5be32a42", fecha: "", adminId: "" },
  { id: 3, hash: "f6cac4638878f6ba9ac0075e5be32a42", fecha: "", adminId: "" },
  { id: 4, hash: "f6cac4638878f6ba9ac0075e5be32a42", fecha: "", adminId: "" },
];

// Tipos de archivo permitidos por defecto
const defaultFileTypes = [".docx", ".ppt", ".pdf", ".djvu", "<vacío>", "<vacío>", "<vacío>", "<vacío>"];

const MaintenanceSection = () => {
  const [fileTypes, setFileTypes] = useState(defaultFileTypes);
  const [maxFileSize] = useState("1000 MB");

  const handleSave = () => {
    console.log("Guardando configuración:", { fileTypes, maxFileSize });
  };

  const handleDeleteBackup = (id: number) => {
    console.log("Eliminando respaldo:", id);
  };

  return (
    <div className="flex gap-6">
      {/* Columna izquierda: Respaldos y Parámetros */}
      <div className="flex-1 space-y-6">
        {/* Sección de Respaldos */}
        <BackupsPanel backups={mockBackups} onDelete={handleDeleteBackup} />

        {/* Sección de Parámetros Globales */}
        <GlobalParametersPanel 
          fileTypes={fileTypes} 
          setFileTypes={setFileTypes}
          maxFileSize={maxFileSize}
          onSave={handleSave}
        />
      </div>

      {/* Columna derecha: Métricas */}
      <MetricsPanel />
    </div>
  );
};

/**
 * BackupsPanel Component
 * ----------------------
 * Panel para gestionar los respaldos del sistema.
 * 
 * Se usa en: MaintenanceSection (este archivo)
 */
interface BackupsPanelProps {
  backups: { id: number; hash: string; fecha: string; adminId: string }[];
  onDelete: (id: number) => void;
}

const BackupsPanel = ({ backups, onDelete }: BackupsPanelProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-foreground mb-4">Respaldos</h2>
      <div className="space-y-3">
        {backups.map((backup) => (
          <div 
            key={backup.id} 
            className="bg-background border border-border rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-6 flex-1">
              <span className="text-sm font-mono text-foreground">{backup.hash}</span>
              <div className="text-sm text-muted-foreground">
                <div>Fecha de creación</div>
                <div>AdminID: {backup.adminId}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(backup.id)}
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * GlobalParametersPanel Component
 * -------------------------------
 * Panel para configurar parámetros globales del sistema.
 * 
 * Se usa en: MaintenanceSection (este archivo)
 */
interface GlobalParametersPanelProps {
  fileTypes: string[];
  setFileTypes: (types: string[]) => void;
  maxFileSize: string;
  onSave: () => void;
}

const GlobalParametersPanel = ({ 
  fileTypes, 
  setFileTypes, 
  maxFileSize, 
  onSave 
}: GlobalParametersPanelProps) => {
  const handleFileTypeChange = (index: number, value: string) => {
    const newTypes = [...fileTypes];
    newTypes[index] = value;
    setFileTypes(newTypes);
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-foreground mb-4">Parámetros globales</h2>
      
      <div className="flex gap-8">
        {/* Lista de tipos de archivo */}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">Tipos de archivo permitidos:</p>
          <div className="space-y-2">
            {fileTypes.map((type, index) => (
              <Input
                key={index}
                value={type}
                onChange={(e) => handleFileTypeChange(index, e.target.value)}
                className="bg-background h-8"
              />
            ))}
          </div>
        </div>

        {/* Tamaño máximo y botón guardar */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tamaño de archivo máximo:</p>
            <p className="text-lg font-medium text-foreground">{maxFileSize}</p>
          </div>
          <Button variant="outline" onClick={onSave} className="mt-4">
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * MetricsPanel Component
 * ----------------------
 * Panel lateral con métricas del sistema.
 * 
 * Se usa en: MaintenanceSection (este archivo)
 */
const MetricsPanel = () => {
  return (
    <div className="w-80 bg-muted/50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-foreground mb-4">Métricas</h2>
      
      {/* Métricas de Usuario */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2">Usuario</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Usuarios conectados:</li>
          <li>Usuarios totales:</li>
          <li>Usuarios suspendidos:</li>
          <li>Número de colaboradores:</li>
        </ul>
      </div>

      {/* Métricas de Plataforma */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2">Plataforma:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Total de visitas:</li>
          <li>Número de subidas (día):</li>
          <li>Número de subidas (mes):</li>
          <li>Número de descargas (día):</li>
          <li>Número de descargas (mes):</li>
        </ul>
      </div>

      {/* Métricas de Repositorio */}
      <div>
        <h3 className="font-semibold text-foreground mb-2">Repositorio:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Número de Recursos Académicos:</li>
          <li>Total de solicitudes:</li>
          <li>Total solicitudes aprobadas:</li>
          <li>Total solicitudes denegadas:</li>
          <li>Número de respaldos:</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceSection;
