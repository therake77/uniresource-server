/**
 * ResourceCard Component
 * ----------------------
 * Tarjeta individual de recurso con:
 * - Imagen placeholder (izquierda)
 * - Título y descripción (centro)
 * - Botones de Actualizar y Eliminar (derecha)
 * 
 * Ubicación: src/components/admin/ResourceCard.tsx
 * Se usa en: src/components/admin/ResourcesSection.tsx
 */

import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  id: string;
  titulo: string;
  informacionExtra: string;
  onActualizar: (id: string) => void;
  onEliminar: (id: string) => void;
}

const ResourceCard = ({ 
  id, 
  titulo, 
  informacionExtra, 
  onActualizar, 
  onEliminar 
}: ResourceCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-4">
      {/* Imagen placeholder del recurso */}
      <div className="w-16 h-16 bg-muted border border-border rounded flex-shrink-0" />

      {/* Información del recurso */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-foreground truncate">
          {titulo}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {informacionExtra}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onActualizar(id)}
          className="min-w-[90px]"
        >
          Actualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEliminar(id)}
          className="min-w-[80px]"
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;

