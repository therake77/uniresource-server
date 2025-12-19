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
  const [resources, setResources] = useState<ResourceReference[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (filters: SearchFiltersData) => {
    const res = await fetch("http://localhost:3000/api/user/search",{
      method: 'GET',
      headers: {
        authorization : `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(filters)
    });
    if(!res.ok){
      if(res.status == 404){
        alert("No se encontraron recursos con los filtros proporcionados.");
        return;
      }
      if(res.status == 401){
        navigate("/");
        return;
      }
      alert(`Error: ${(await res.json()).message}`);
      return;
    }
    
    const foundResources = await res.json();
    setResources(foundResources);
  };

  const handleSee = (id: string) => {
      navigate(`/user/resource/${id}`);
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
