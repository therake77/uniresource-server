import { useEffect, useState } from "react";
import ResourceCard from "../ResourcesCard";
import { useNavigate } from "react-router-dom";

interface ResourceDto {
  rsrc_id: number;
  name: string;
  authors: string[];
} ;

const getMyResources = async () => {
  const res = await fetch("http://localhost:3000/api/collab/myResources",{
      method : 'GET',
      headers :{
          authorization : `Bearer ${localStorage.getItem('access_token')}`
      }
  })
  if(!res.ok){
    if(res.status==401){
        useNavigate()("/");
    }
    if(res.status == 404){
        return [];
    }
  }
  return await res.json();
}

const MyResourcesSection = () => {
  const [resources, setResources] = useState<ResourceDto[]>([]);
  useEffect(()=>{
    const resourcesFound =  getMyResources();
    resourcesFound.then((resources) => setResources(resources));
  })
  const handleGetResource = (id: string) => {
    console.log(`Get resource with id: ${id}`);
    // Aquí puedes agregar la lógica para manejar la obtención del recurso

  };

  if(resources.length==0){
    return (
      <div className="text-center text-muted-foreground py-12">No resources found.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.rsrc_id}
            id={resource.rsrc_id.toString()}
            titulo={resource.name}
            informacionExtra={resource.authors.join(", ")}
            onGetResource={handleGetResource}
          />
        ))}
      </div>
    </div>
  );
};

export default MyResourcesSection;
