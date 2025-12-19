/**
 * ResourcesSection Component
 * --------------------------
 * Sección principal de "Ver Recursos" que incluye:
 * - Lista de recursos (vista por defecto)
 * - Vista de actualización de recurso
 * - Vista de eliminación de recurso
 * - Vista de confirmación de eliminación
 * 
 * Ubicación: src/components/admin/ResourcesSection.tsx
 * Se usa en: src/pages/AdminDashboard.tsx
 */

import { useState } from "react";
import SearchFilters, { SearchFiltersData } from "./SearchFilters";
import ResourceCard from "@/pages/admin/ResourcesCard";
import ResourceUpdateView from "@/pages/admin/resource_admin/ResourceUptadeView";
import ResourceDeleteView from "@/pages/admin/resource_admin/ResourceDeleteView";
import ResourceDeleteConfirmView from "@/pages/admin/resource_admin/ResourceDeleteConfirmView";
import { useToast } from "@/hooks/use-toast";

// Tipo para los datos del recurso
interface ResourceData {
  id: string;
  titulo: string;
  informacionExtra: string;
  autores?: string;
  fechaPublicacion?: string;
  escuela?: string;
  tipo?: string;
  ciclo?: string;
  descripcion?: string;
}

// Tipo para el estado de la vista
type ViewState = "list" | "update" | "delete" | "deleteConfirm";

// Datos de ejemplo para los recursos
const mockResources: ResourceData[] = [
  { id: "1", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "2", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "3", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "4", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "5", titulo: "(Título)", informacionExtra: "Información extra" },
];

const ResourcesSection = () => {
  const [resources] = useState<ResourceData[]>(mockResources);
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [deleteMotivo, setDeleteMotivo] = useState("");
  const { toast } = useToast();

  const handleSearch = (filters: SearchFiltersData) => {
    console.log("Buscando con filtros:", filters);
    toast({
      title: "Búsqueda realizada",
      description: `Buscando: "${filters.busqueda || "todos"}"`,
    });
  };

  const handleActualizar = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setSelectedResource(resource);
      setViewState("update");
    }
  };

  const handleEliminar = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setSelectedResource(resource);
      setViewState("delete");
    }
  };

  const handleUpdateSubmit = (data: ResourceData) => {
    console.log("Actualizando recurso:", data);
    toast({
      title: "Recurso actualizado",
      description: `El recurso "${data.titulo}" ha sido actualizado.`,
    });
    setViewState("list");
    setSelectedResource(null);
  };

  const handleDeleteSubmit = (motivo: string) => {
    setDeleteMotivo(motivo);
    setViewState("deleteConfirm");
  };

  const handleDeleteConfirm = (email: string, password: string) => {
    console.log("Confirmando eliminación:", { email, motivo: deleteMotivo });
    toast({
      title: "Recurso eliminado",
      description: `El recurso ha sido eliminado exitosamente.`,
      variant: "destructive",
    });
    setViewState("list");
    setSelectedResource(null);
    setDeleteMotivo("");
  };

  const handleBack = () => {
    if (viewState === "deleteConfirm") {
      setViewState("delete");
    } else {
      setViewState("list");
      setSelectedResource(null);
    }
  };

  // Renderizar según el estado de la vista
  if (viewState === "update" && selectedResource) {
    return (
      <ResourceUpdateView
        resource={selectedResource}
        onBack={handleBack}
        onUpdate={handleUpdateSubmit}
      />
    );
  }

  if (viewState === "delete" && selectedResource) {
    return (
      <ResourceDeleteView
        resource={selectedResource}
        onBack={handleBack}
        onDelete={handleDeleteSubmit}
      />
    );
  }

  if (viewState === "deleteConfirm") {
    return (
      <ResourceDeleteConfirmView
        onBack={handleBack}
        onConfirm={handleDeleteConfirm}
      />
    );
  }

  // Vista por defecto: lista de recursos
  return (
    <div className="space-y-6">
      {/* Componente de filtros de búsqueda */}
      <SearchFilters onSearch={handleSearch} />

      {/* Lista de recursos */}
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            id={resource.id}
            titulo={resource.titulo}
            informacionExtra={resource.informacionExtra}
            onActualizar={handleActualizar}
            onEliminar={handleEliminar}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;
