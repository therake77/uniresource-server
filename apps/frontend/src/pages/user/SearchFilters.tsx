import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersData) => void;
}

export interface SearchFiltersData {
  name?: string | null;
  school?: string | null;
  course?: string | null;
  type?: string | null;
  semester?: number | null;
  authors?: string[] | null;
  dateOfPublish?: Date | null;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const getValue = (key: string) => {
      const val = formData.get(key) as string;
      return val === "" ? null : val;
    };
    const authorsString = getValue("authors");
    const authors = authorsString ? authorsString.split(",").map(a => a.trim()) : null;
    const semesterString = getValue("semester");
    const semester = semesterString ? parseInt(semesterString, 10) : null;
    const dateString = getValue("dateOfPublish");
    const dateOfPublish = dateString ? new Date(dateString) : null;
    onSearch({
      name: getValue("name"),
      school: getValue("school"),
      course: getValue("course"),
      type: getValue("type"),
      semester,
      authors,
      dateOfPublish,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-muted/50 p-4 rounded-lg border border-border">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <label htmlFor="name" className="text-sm font-medium text-foreground whitespace-nowrap">Nombre:</label>
          <Input id="name" name="name" placeholder="Nombre del recurso" className="flex-1 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="school" className="text-sm font-medium text-foreground whitespace-nowrap">Escuela:</label>
          <Input id="school" name="school" placeholder="Escuela" className="w-32 bg-background" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="course" className="text-sm font-medium text-foreground whitespace-nowrap">Curso:</label>
          <Input id="course" name="course" placeholder="Curso" className="w-32 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-sm font-medium text-foreground whitespace-nowrap">Tipo:</label>
          <Input id="type" name="type" placeholder="Tipo" className="w-24 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="semester" className="text-sm font-medium text-foreground whitespace-nowrap">Semestre:</label>
          <Input id="semester" name="semester" type="number" placeholder="Semestre" className="w-24 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="authors" className="text-sm font-medium text-foreground whitespace-nowrap">Autores:</label>
          <Input id="authors" name="authors" placeholder="Autor1, Autor2" className="w-48 bg-background" />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dateOfPublish" className="text-sm font-medium text-foreground whitespace-nowrap">Fecha de Publicación:</label>
          <Input id="dateOfPublish" name="dateOfPublish" type="date" className="w-40 bg-background" />
        </div>

        <Button type="submit" variant="outline" className="ml-auto">Buscar</Button>
      </div>
    </form>
  );
};

export default SearchFilters;
