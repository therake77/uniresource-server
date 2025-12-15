/**
 * ResourcesSection Component
 * --------------------------
 * Sección principal de "Ver Recursos" que incluye:
 * - Filtros de búsqueda (SearchFilters)
 * - Lista de recursos (ResourceCard)
 * 
 * Ubicación: src/components/admin/ResourcesSection.tsx
 * Se usa en: src/pages/AdminDashboard.tsx
 */

import { useState } from "react";
import SearchFilters, { SearchFiltersData } from "./SearchFilters";
import ResourceCard from "./ResourcesCard";
import { useToast } from "@/hooks/use-toast";  

// Datos de ejemplo para los recursos
const mockResources = [
  { id: "1", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "2", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "3", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "4", titulo: "(Título)", informacionExtra: "Información extra" },
  { id: "5", titulo: "(Título)", informacionExtra: "Información extra" },
];

const ResourcesSection = () => {
  const [resources] = useState(mockResources);
  const { toast } = useToast();

  const handleSearch = (filters: SearchFiltersData) => {
    console.log("Buscando con filtros:", filters);
    toast({
      title: "Búsqueda realizada",
      description: `Buscando: "${filters.busqueda || "todos"}"`,
    });
  };

  const handleActualizar = (id: string) => {
    console.log("Actualizar recurso:", id);
    toast({
      title: "Actualizar recurso",
      description: `Editando recurso ID: ${id}`,
    });
  };

  const handleEliminar = (id: string) => {
    console.log("Eliminar recurso:", id);
    toast({
      title: "Eliminar recurso",
      description: `Eliminando recurso ID: ${id}`,
      variant: "destructive",
    });
  };

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