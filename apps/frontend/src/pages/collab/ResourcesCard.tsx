import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  id: string;
  titulo: string;
  informacionExtra: string;
  onGetResource: (id: string) => void;
}

const ResourceCard = ({ id, titulo, informacionExtra, onGetResource }: ResourceCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-4">
      <div className="w-16 h-16 bg-muted border border-border rounded flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-foreground truncate">{titulo}</h3>
        <p className="text-sm text-muted-foreground truncate">{informacionExtra}</p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={() => onGetResource(id)} className="min-w-[90px]">Ver</Button>
      </div>
    </div>
  );
};

export default ResourceCard;
