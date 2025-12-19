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
    console.log('Filters received:', filters);

    const res = await fetch("http://localhost:3000/api/user/search",{
      method: 'POST',
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem('access_token')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: filters.name || undefined,
        type: filters.type || undefined,
        dateOfPublish: filters.dateOfPublish ? new Date(filters.dateOfPublish) : undefined, 
        school: filters.school || undefined,
        semester: filters.semester || undefined,
        authors: filters.authors || undefined,
        course: filters.course || undefined,
      })
    });

    if(!res.ok){
      if(res.status == 404){
        alert("No se encontraron recursos con los filtros proporcionados.");
        setResources([]);
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
            informacionExtra={`Autores: ${resource.authors.join(", ")}`}
            onSee={handleSee}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesSection;
