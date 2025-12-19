import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<ResourceReference | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) {
        navigate("/user");
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/api/user/rsrc_ref/${id}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            navigate("/");
          } else if (res.status === 404) {
            alert("Recurso no encontrado.");
            navigate("/user");
          }
          return;
        }

        const data = await res.json();
        setResource({
          ...data,
          publish_date: new Date(data.publish_date),
          upload_date: new Date(data.upload_date)
        });
      } catch (error) {
        console.error("Error fetching resource:", error);
        alert("Error al cargar el recurso");
        navigate("/user");
      }
    };

    fetchResource();
  }, [id, navigate]);
  

  const handleDownload = async () => {
    // TODO: implement download
    alert("Download functionality to be implemented");
  };

  const handleVisualize = async () => {
    // TODO: implement visualize
    alert("Visualize functionality to be implemented");
  };

  if (!resource) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Recurso no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">{resource.name}</h1>
        <Button onClick={() => navigate(-1)} variant="outline">
          Volver
        </Button>
      </div>

      <div className="bg-background border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">ID del Recurso</label>
            <p className="text-lg text-foreground">{resource.rsrc_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
            <p className="text-lg text-foreground">{resource.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Fecha de Publicación</label>
            <p className="text-lg text-foreground">{new Date(resource.publish_date).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Fecha de Subida</label>
            <p className="text-lg text-foreground">{new Date(resource.upload_date).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Curso</label>
            <p className="text-lg text-foreground">{resource.course}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Semestre</label>
            <p className="text-lg text-foreground">{resource.semester}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Escuela</label>
            <p className="text-lg text-foreground">{resource.school}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Autores</label>
            <p className="text-lg text-foreground">{resource.authors.join(", ")}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Descripción</label>
          <p className="text-lg text-foreground mt-1">{resource.description}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleDownload} variant="outline">
            Download
          </Button>
          <Button onClick={handleVisualize} variant="outline">
            Visualize
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;