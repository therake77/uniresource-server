/**
 * ResourceDeleteView Component
 * ----------------------------
 * Vista para eliminar un recurso con información y motivo.
 * 
 * Ubicación: src/components/admin/resources/ResourceDeleteView.tsx
 * Se usa en: src/components/admin/ResourcesSection.tsx
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface ResourceData {
  id: string;
  titulo: string;
  autores?: string;
  fechaPublicacion?: string;
  escuela?: string;
  tipo?: string;
  ciclo?: string;
}

interface ResourceDeleteViewProps {
  resource: ResourceData;
  onBack: () => void;
  onDelete: (motivo: string) => void;
}

const ResourceDeleteView = ({ resource, onBack, onDelete }: ResourceDeleteViewProps) => {
  const [motivo, setMotivo] = useState("");

  const handleDelete = () => {
    onDelete(motivo);
  };

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-foreground">Eliminar Recurso</h2>

      {/* Pregunta de confirmación */}
      <p className="text-foreground text-lg">¿Está seguro de eliminar este recurso?</p>

      {/* Información del recurso */}
      <div className="flex gap-6">
        {/* Imagen placeholder */}
        <div className="w-40 h-40 bg-muted border border-border rounded flex-shrink-0 flex items-center justify-center">
          <span className="text-muted-foreground">Imagen</span>
        </div>

        {/* Datos del recurso */}
        <div className="bg-muted/50 rounded-lg p-4 flex-1">
          <div className="space-y-1">
            <p className="text-foreground"><span className="font-medium">Título</span></p>
            <p className="text-foreground"><span className="font-medium">Autor(es)</span></p>
            <p className="text-foreground"><span className="font-medium">Fecha de publicación</span></p>
            <p className="text-foreground"><span className="font-medium">Ciclo</span></p>
            <p className="text-foreground"><span className="font-medium">Escuela</span></p>
            <p className="text-foreground"><span className="font-medium">Tipo</span></p>
          </div>
        </div>
      </div>

      {/* Motivo de eliminación */}
      <div className="space-y-2">
        <p className="text-foreground text-lg">Ingrese el motivo de la eliminación</p>
        <Textarea
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="bg-muted/50 border-border min-h-[120px]"
        />
      </div>

      {/* Botón eliminar */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleDelete}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default ResourceDeleteView;
