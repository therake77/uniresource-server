/**
 * RequestsSection Component
 * -------------------------
 * Sección para revisar solicitudes pendientes.
 * Incluye:
 * - Campo de búsqueda por ID
 * - Lista de tarjetas de solicitudes con tipo, fecha y usuario
 * - Vista detallada de solicitud con frames de objeto y modificación
 *
 * Ubicación: src/components/admin/RequestsSection.tsx
 * Se usa en: src/pages/AdminDashboard.tsx (cuando activeSection === "solicitudes")
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Datos de ejemplo de solicitudes
const mockRequests = [
  { id: 1, numero: "#(número)", tipo: "", fecha: "", usuarioId: "" },
  { id: 2, numero: "#(número)", tipo: "", fecha: "", usuarioId: "" },
  { id: 3, numero: "#(número)", tipo: "", fecha: "", usuarioId: "" },
  { id: 4, numero: "#(número)", tipo: "", fecha: "", usuarioId: "" },
  { id: 5, numero: "#(número)", tipo: "", fecha: "", usuarioId: "" },
];

const RequestsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const handleSearch = () => {
    console.log("Buscando solicitud:", searchTerm);
  };

  const handleAttendRequest = (requestId: number) => {
    setSelectedRequest(requestId);
  };

  const handleBack = () => {
    setSelectedRequest(null);
  };

  // Si hay una solicitud seleccionada, mostrar la vista de detalle
  if (selectedRequest !== null) {
    const request = mockRequests.find(r => r.id === selectedRequest);
    if (request) {
      return <RequestDetailView request={request} onBack={handleBack} />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium whitespace-nowrap">ID:</span>
          <Input
            type="text"
            placeholder="Palabra clave"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-background"
          />
          <div className="flex-1" />
          <Button
            variant="secondary"
            className="bg-foreground text-background hover:bg-foreground/90"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-4">
        {mockRequests.map((request) => (
          <RequestCard
            key={request.id}
            numero={request.numero}
            tipo={request.tipo}
            fecha={request.fecha}
            usuarioId={request.usuarioId}
            onAttend={() => handleAttendRequest(request.id)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * RequestCard Component
 * ---------------------
 * Tarjeta individual para mostrar información de una solicitud.
 *
 * Se usa en: RequestsSection (este archivo)
 */
interface RequestCardProps {
  numero: string;
  tipo: string;
  fecha: string;
  usuarioId: string;
  onAttend: () => void;
}

const RequestCard = ({ numero, tipo, fecha, usuarioId, onAttend }: RequestCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Solicitud {numero}</h3>
          <p className="text-sm text-muted-foreground">Tipo solicitud: {tipo}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Fecha de envío: {fecha}
        </div>
        <div className="text-sm text-muted-foreground">
          Usuario ID: {usuarioId}
        </div>
      </div>
      <Button variant="outline" className="min-w-[80px]" onClick={onAttend}>
        Atender
      </Button>
    </div>
  );
};

/**
 * RequestDetailView Component
 * ---------------------------
 * Vista detallada de una solicitud con frames de objeto y modificación.
 * Incluye:
 * - Resumen con tipo, fecha y usuario ID
 * - Frame de Objeto de solicitud con tipo, ID y botón ver
 * - Frame de Modificación con tipo, ID y botón ver
 * - Botones de Aprobar y Denegar
 *
 * Se usa en: RequestsSection (este archivo)
 */
interface Request {
  id: number;
  numero: string;
  tipo: string;
  fecha: string;
  usuarioId: string;
}

interface RequestDetailViewProps {
  request: Request;
  onBack: () => void;
}

const RequestDetailView = ({ request, onBack }: RequestDetailViewProps) => {
  const handleApprove = () => {
    console.log("Solicitud aprobada:", request.id);
    // Aquí iría la lógica para aprobar la solicitud
  };

  const handleDeny = () => {
    console.log("Solicitud denegada:", request.id);
    // Aquí iría la lógica para denegar la solicitud
  };

  const handleViewRequestObject = () => {
    console.log("Ver objeto de solicitud");
    // Aquí iría la lógica para ver el objeto de solicitud
  };

  const handleViewModification = () => {
    console.log("Ver modificación");
    // Aquí iría la lógica para ver la modificación
  };

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <Button variant="outline" onClick={onBack}>
        ← Volver
      </Button>

      {/* Frame de Resumen */}
      <div className="bg-muted/50 p-6 rounded-lg space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Resumen</h2>

        {/* Información básica */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-medium">Tipo de solicitud:</span>
            <span className="text-muted-foreground">{request.tipo}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-foreground font-medium">Fecha de solicitud:</span>
            <span className="text-muted-foreground">{request.fecha}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-foreground font-medium">Usuario ID:</span>
            <span className="text-muted-foreground">{request.usuarioId}</span>
          </div>
        </div>

        {/* Frame 1: Objeto de solicitud */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Objeto de solicitud</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">Tipo:</span>
              <span className="text-muted-foreground">Usuario/Recurso</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">Objeto ID:</span>
              <span className="text-muted-foreground">(id)</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleViewRequestObject}>
            Ver
          </Button>
        </div>

        {/* Frame 2: Modificación */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Modificación</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">Tipo:</span>
              <span className="text-muted-foreground">Usuario/Recurso</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">Objeto ID:</span>
              <span className="text-muted-foreground">(id)</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleViewModification}>
            Ver
          </Button>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleApprove}
          >
            Aprobar
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDeny}
          >
            Denegar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestsSection;
