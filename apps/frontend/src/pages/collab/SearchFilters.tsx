import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersData) => void;
}

export interface SearchFiltersData {
  nombre: string;
  tipo: string;
  fechaDePublicacion: string;
  escuela: string;
  semestre: string;
  autores: string[];
  curso:string;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSearch({
      nombre: (formData.get("nombre") as string),
      fechaDePublicacion: (formData.get("fechaDePublicacion") as string),
      escuela: (formData.get("escuela") as string),
      curso: (formData.get("curso") as string),
      tipo: (formData.get("tipo") as string),
      semestre: (formData.get("semestre") as string),
      autores: ((formData.get("autores") as string) || "").split(",").map(a => a.trim()).filter(a => a.length > 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-muted/50 p-4 rounded-lg border border-border">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <label htmlFor="busqueda" className="text-sm font-medium text-foreground whitespace-nowrap">Búsqueda:</label>
          <Input id="busqueda" name="busqueda" placeholder="Palabra clave" className="flex-1 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="escuela" className="text-sm font-medium text-foreground whitespace-nowrap">Escuela:</label>
          <Input id="escuela" name="escuela" placeholder="Escuela" className="w-32 bg-background" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="curso" className="text-sm font-medium text-foreground whitespace-nowrap">Curso:</label>
          <Input id="curso" name="curso" placeholder="Curso" className="w-32 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="tipo" className="text-sm font-medium text-foreground whitespace-nowrap">Tipo:</label>
          <Input id="tipo" name="tipo" placeholder="Tipo" className="w-24 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="ciclo" className="text-sm font-medium text-foreground whitespace-nowrap">Ciclo:</label>
          <Input id="ciclo" name="ciclo" placeholder="Ciclo" className="w-24 bg-background" />
        </div>

        <Button type="submit" variant="outline" className="ml-auto">Buscar</Button>
      </div>
    </form>
  );
};

export default SearchFilters;
