import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RequestDto {
  request_id: number;
  requestType: string;
  requestor: number;
  obj_affected?: number;
  obj_affecting?: number;
  status: string;
}

const  MyRequestsSection = () => {
  // Mock data - replace with actual API call
  const getCollabRequests = async ()=>{
    const res = await fetch("http://localhost:3000/api/collab/myRequests",{
        method : 'GET',
        headers :{
            authorization : `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    if(!res.ok){
        if(res.status==401){
            useNavigate()("/");
        }
        alert(`Error: ${(await res.json()).message}`)
        useNavigate()("/collab");
    }
    return await res.json();
  }
  
  const [requests, setRequests] = useState<RequestDto[]>([]);
  useEffect(()=>{
    const requestsFound =  getCollabRequests();
    requestsFound.then((requests) => setRequests(requests));
  })
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "text-yellow-600 bg-yellow-100";
      case "APROBADO":
        return "text-green-600 bg-green-100";
      case "DENEGADO":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Mis Solicitudes</h2>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.request_id}
            className="bg-background border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-lg font-medium text-foreground">
                  Solicitud #{request.request_id}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Tipo:</span> {request.requestType}
                </div>
                <div>
                  <span className="font-medium">Solicitante:</span> {request.requestor}
                </div>
                {request.obj_affected && (
                  <div>
                    <span className="font-medium">Objeto Afectado:</span> {request.obj_affected}
                  </div>
                )}
                {request.obj_affecting && (
                  <div>
                    <span className="font-medium">Objeto Afectante:</span> {request.obj_affecting}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequestsSection;