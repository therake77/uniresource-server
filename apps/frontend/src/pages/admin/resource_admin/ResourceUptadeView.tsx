/**
 * ResourceUpdateView Component
 * -----------------------------
 * Vista para actualizar un recurso con formulario de edición.
 * 
 * Ubicación: src/components/admin/resources/ResourceUpdateView.tsx
 * Se usa en: src/components/admin/ResourcesSection.tsx
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

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

interface ResourceUpdateViewProps {
  resource: ResourceData;
  onBack: () => void;
  onUpdate: (data: ResourceData) => void;
}

const ResourceUpdateView = ({ resource, onBack, onUpdate }: ResourceUpdateViewProps) => {
  const [formData, setFormData] = useState<ResourceData>(resource);

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Botón volver */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-foreground">Actualizar recurso</h2>

      {/* Instrucción */}
      <p className="text-muted-foreground">
        Debe especificar por lo menos un campo a actualizar. Sólo rellene lo que va a actualizar
      </p>

      <div className="flex gap-8">
        {/* Sección de imagen */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-foreground font-medium">Actualizar imagen</p>
          <div className="w-48 h-48 bg-muted border border-border rounded" />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Subir imagen
          </Button>
        </div>

        {/* Formulario de datos */}
        <div className="flex-1">
          <p className="text-foreground font-medium mb-4">Actualizar datos:</p>
          
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            {/* Título */}
            <div>
              <label className="text-sm text-foreground mb-1 block">Modificar título</label>
              <Input
                placeholder="Título1"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            {/* Autores */}
            <div>
              <label className="text-sm text-foreground mb-1 block">Modificar autor(es)</label>
              <Input
                placeholder="Autor1, Autor2, ..."
                value={formData.autores || ""}
                onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
                className="bg-background border-border"
              />
            </div>

            {/* Fecha y Escuela */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-foreground mb-1 block">Modificar fecha de publicación</label>
                <Input
                  placeholder="YY-MM-DD"
                  value={formData.fechaPublicacion || ""}
                  onChange={(e) => setFormData({ ...formData, fechaPublicacion: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1 block">Modificar escuela</label>
                <Input
                  placeholder="Ciencias de la computación"
                  value={formData.escuela || ""}
                  onChange={(e) => setFormData({ ...formData, escuela: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Tipo y Ciclo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-foreground mb-1 block">Modificar tipo</label>
                <Input
                  placeholder="Libro, clase, otro, etc"
                  value={formData.tipo || ""}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1 block">Modificar ciclo:</label>
                <Input
                  placeholder="Ciclo"
                  value={formData.ciclo || ""}
                  onChange={(e) => setFormData({ ...formData, ciclo: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm text-foreground mb-1 block">Modificar descripción</label>
              <Textarea
                placeholder="Descripción"
                value={formData.descripcion || ""}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="bg-background border-border min-h-[100px]"
              />
            </div>

            {/* Botón adjuntar archivo */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                Adjuntar archivo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Botón actualizar */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[200px]"
        >
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export default ResourceUpdateView;
