import { useState } from "react";
import SearchFilters, { SearchFiltersData } from "./SearchFilters";
import ResourceCard from "./ResourcesCard";
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

const ResourcesSection = () => {
  const [resources, setResources] = useState<ResourceReference[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (filters: SearchFiltersData) => {
    const res = await fetch("http://localhost:3000/api/user/search",{
      method: 'POST',
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem('access_token')}`,
        "Content-type" : 'application/json'
      },
      body: JSON.stringify({
        name: filters.name,
        type: filters.type,
        dateOfPublish: filters.dateOfPublish,
        school: filters.school,
        semester: filters.semester,
        authors: filters.authors,
        course: filters.course
      })
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
