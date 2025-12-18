import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const uploadSection = () => {
    const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    publish_date: "",
    course: "",
    semester: "",
    school: "",
    description: "",
    isDownloadable: false,
    authors: "",
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Validation: Check for empty fields
    if (!formData.name.trim()) {
      alert("El campo 'Nombre' es obligatorio.");
      return;
    }
    if (!formData.type.trim()) {
      alert("El campo 'Tipo' es obligatorio.");
      return;
    }
    if (!formData.publish_date) {
      alert("El campo 'Fecha de Publicación' es obligatorio.");
      return;
    }
    if (!formData.course.trim()) {
      alert("El campo 'Curso' es obligatorio.");
      return;
    }
    if (!formData.semester || parseInt(formData.semester) <= 0) {
      alert("El campo 'Semestre' debe ser un número mayor a 0.");
      return;
    }
    if (!formData.school.trim()) {
      alert("El campo 'Escuela' es obligatorio.");
      return;
    }
    if (!formData.description.trim()) {
      alert("El campo 'Descripción' es obligatorio.");
      return;
    }
    const authors = formData.authors.split(",").map(a => a.trim()).filter(a => a);
    if (authors.length === 0) {
      alert("Debe ingresar al menos un autor.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("publish_date", formData.publish_date);
    data.append("course", formData.course);
    data.append("semester", formData.semester.toString());
    data.append("school", formData.school);
    data.append("description", formData.description);
    data.append("isDownloadable", formData.isDownloadable.toString());
    for (const author of authors) {
      data.append("authors[]", author);
    }

    const res = await fetch("http://localhost:3000/api/collab/upload", {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: data,
    });
    if (!res.ok) {
      alert(`Error: ${(await res.json()).message}`);
      return;
    }
    alert("Recurso subido exitosamente con id : " + await res.text());
    useNavigate()("/collab");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background border border-border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">Subir Nuevo Recurso</h2>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground font-medium">Tipo</Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="publish_date" className="text-foreground font-medium">Fecha de Publicación</Label>
            <Input
              id="publish_date"
              name="publish_date"
              type="date"
              value={formData.publish_date}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course" className="text-foreground font-medium">Curso</Label>
            <Input
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="semester" className="text-foreground font-medium">Semestre</Label>
            <Input
              id="semester"
              name="semester"
              type="number"
              value={formData.semester}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school" className="text-foreground font-medium">Escuela</Label>
            <Input
              id="school"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              className="border-border focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">Descripción</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authors" className="text-foreground font-medium">Autores (separados por coma)</Label>
          <Input
            id="authors"
            name="authors"
            value={formData.authors}
            onChange={handleInputChange}
            placeholder="Autor1, Autor2, Autor3"
            className="border-border focus:ring-primary"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isDownloadable"
            name="isDownloadable"
            type="checkbox"
            checked={formData.isDownloadable}
            onChange={handleInputChange}
            className="rounded border-border"
          />
          <Label htmlFor="isDownloadable" className="text-foreground font-medium">Descargable</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file" className="text-foreground font-medium">Archivo</Label>
          <Input
            id="file"
            type="file"
            onChange={onFileChange}
            className="border-border focus:ring-primary"
            required
          />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg">
            Subir Recurso
          </Button>
        </div>
      </form>
    </div>
  );
}
export default uploadSection;