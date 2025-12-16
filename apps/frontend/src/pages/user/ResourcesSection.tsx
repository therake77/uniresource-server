import { useState } from "react";
import SearchFilters, { SearchFiltersData } from "./SearchFilters";
import ResourceCard from "./ResourcesCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ResourceReference {
  rsrc_id: number;
  name: string;
  type: string;
  publish_date: Date;
  upload_date: Date;
  course: string;
  semester: number;
  school: string;
  description: string;
  authors: string[];
}

const mockResources: ResourceReference[] = [
  {
    rsrc_id: 1,
    name: "Recurso de Matemáticas",
    type: "PDF",
    publish_date: new Date("2023-01-01"),
    upload_date: new Date("2023-01-15"),
    course: "Álgebra",
    semester: 1,
    school: "Facultad de Ciencias",
    description: "Material de estudio para álgebra básica.",
    authors: ["Autor 1", "Autor 2"],
  },
  {
    rsrc_id: 2,
    name: "Guía de Física",
    type: "Documento",
    publish_date: new Date("2023-02-01"),
    upload_date: new Date("2023-02-10"),
    course: "Física General",
    semester: 2,
    school: "Facultad de Ciencias",
    description: "Guía completa para el curso de física.",
    authors: ["Profesor X"],
  },
  {
    rsrc_id: 3,
    name: "Ejercicios de Programación",
    type: "Archivo",
    publish_date: new Date("2023-03-01"),
    upload_date: new Date("2023-03-05"),
    course: "Programación",
    semester: 3,
    school: "Facultad de Ingeniería",
    description: "Ejercicios prácticos para aprender programación.",
    authors: ["Desarrollador A", "Desarrollador B"],
  },
];

const ResourcesSection = () => {
  const [resources] = useState(mockResources);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFiltersData) => {
    console.log("User buscar:", filters);
    toast({ title: "Búsqueda realizada", description: `Buscando: "${filters.busqueda || "todos"}"` });
  };

  const handleSee = (id: string) => {
    const resource = resources.find(r => r.rsrc_id.toString() === id);
    if (resource) {
      navigate(`/user/resource/${id}`, { state: { resource } });
    }
  };

  return (
    <div className="space-y-6">
      <SearchFilters onSearch={handleSearch} />
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.rsrc_id}
            id={resource.rsrc_id.toString()}
            titulo={resource.name}
            informacionExtra={`Tipo: ${resource.type} | Autores: ${resource.authors.join(", ")}`}
            onSee={handleSee}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;
