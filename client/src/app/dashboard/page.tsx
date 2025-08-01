"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import RequestCard, {
  PharmacyResponse,
  RequestData,
} from "@/components/RequestCard";
import Navbar from "@/components/Navbar";
import NewRequestModal from "@/components/NewRequestModal";

// Sample pharmacy data for responses
const nearbyPharmacies = [
  {
    name: "Farmacia Central",
    distance: "1.2km",
    address: "Calle Mayor 45, Madrid",
    phone: "915551234",
  },
  {
    name: "Farmacia San Juan",
    distance: "2.5km",
    address: "Avenida Principal 78, Madrid",
    phone: "914567890",
  },
  {
    name: "Farmacia del Carmen",
    distance: "3.0km",
    address: "Plaza del Sol 12, Madrid",
    phone: "917778899",
  },
  {
    name: "Farmacia Nueva",
    distance: "3.8km",
    address: "Calle Alcalá 123, Madrid",
    phone: "910001122",
  },
  {
    name: "Farmacia Plaza",
    distance: "4.2km",
    address: "Gran Vía 56, Madrid",
    phone: "913334455",
  },
  {
    name: "Farmacia Norte",
    distance: "5.0km",
    address: "Paseo de la Castellana 200, Madrid",
    phone: "912223344",
  },
];

// Response types to randomly assign
const responseTypes: ("have" | "substitute" | "notSure" | "notHave")[] = [
  "have",
  "substitute",
  "notSure",
  "notHave",
];

// Sample data for requests
const sampleRequests: RequestData[] = [
  {
    id: "1",
    date: "05/11/2020",
    time: "16:24:21",
    cnCode: "7155270",
    drugPresentation: "ABACAT, 10 SOBRES GRANULADO PARA SOLUCION ORAL",
    pharmacyName: "Farmacia 1",
    owner: "Titular 1",
    address: "c/ oza 45 Madrid 36001",
    phone: "0000000",
    responses: [
      {
        pharmacyName: "Farmacia Central",
        response: "have",
        date: "05/11/2020",
        time: "16:30:00",
        distance: "1.2km",
        address: "Calle Mayor 45, Madrid",
        phone: "915551234",
      },
      {
        pharmacyName: "Farmacia San Juan",
        response: "substitute",
        date: "05/11/2020",
        time: "16:45:10",
        distance: "2.5km",
        address: "Avenida Principal 78, Madrid",
        phone: "914567890",
      },
      {
        pharmacyName: "Farmacia del Carmen",
        response: "notSure",
        date: "05/11/2020",
        time: "17:12:22",
        distance: "3.0km",
        address: "Plaza del Sol 12, Madrid",
        phone: "917778899",
      },
    ],
  },
  {
    id: "2",
    date: "05/11/2020",
    time: "15:30:10",
    cnCode: "8392104",
    drugPresentation: "EBASTEL FORTE 20mg 10 COMPRIMIDOS",
    pharmacyName: "Farmacia 2",
    owner: "Titular 2",
    address: "Av. de la Constitución 23, Sevilla",
    phone: "1111111",
    responses: [
      {
        pharmacyName: "Farmacia Plaza",
        response: "have",
        date: "05/11/2020",
        time: "16:20:10",
        distance: "4.2km",
        address: "Gran Vía 56, Madrid",
        phone: "913334455",
      },
      {
        pharmacyName: "Farmacia Norte",
        response: "notHave",
        date: "05/11/2020",
        time: "17:05:30",
        distance: "5.0km",
        address: "Paseo de la Castellana 200, Madrid",
        phone: "912223344",
      },
    ],
  },
  {
    id: "3",
    date: "04/11/2020",
    time: "09:12:45",
    cnCode: "7654321",
    drugPresentation: "GELOCATIL 650mg 40 COMPRIMIDOS",
    pharmacyName: "Farmacia 3",
    owner: "Titular 3",
    address: "Plaza Mayor 5, Barcelona",
    phone: "2222222",
    responses: [],
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState<RequestData[]>(sampleRequests);
  const [myRequests, setMyRequests] = useState<RequestData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newNotification, setNewNotification] = useState<RequestData | null>(
    null
  );

  useEffect(() => {
    // Set all the sample requests as other pharmacies' requests
    const processedRequests = sampleRequests.map((req) => ({
      ...req,
      isMyRequest: false,
    }));

    setRequests(processedRequests);

    // Simulate a new request notification after a few seconds
    const timer = setTimeout(() => {
      const newRequest: RequestData = {
        id: "new-notification",
        date: new Date().toLocaleDateString("es-ES"),
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        cnCode: "7155270",
        drugPresentation: "ABACAT, 10 SOBRES GRANULADO PARA SOLUCION ORAL",
        pharmacyName: "Farmacia Urgente",
        owner: "Dr. López",
        address: "Calle del Sol 22, Valencia 46001",
        phone: "9876543",
        responses: [],
        isUrgent: true,
      };

      setNewNotification(newRequest);
      setRequests((prev) => [newRequest, ...prev]);
      setIsNotificationOpen(true);

      toast.info("New urgent request received", {
        description: "Someone needs ABACAT urgently",
      });
    }, 10000); // Show notification after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // Generate random responses for a new request
  const generateResponses = (requestId: string) => {
    // First batch of responses (2-3)
    setTimeout(() => {
      const firstBatchCount = Math.floor(Math.random() * 2) + 2; // 2-3 responses
      const firstResponses: PharmacyResponse[] = [];

      for (let i = 0; i < firstBatchCount; i++) {
        const pharmacy = nearbyPharmacies[i];
        const response: PharmacyResponse = {
          pharmacyName: pharmacy.name,
          response:
            responseTypes[Math.floor(Math.random() * responseTypes.length)],
          date: new Date().toLocaleDateString("es-ES"),
          time: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          distance: pharmacy.distance,
          address: pharmacy.address,
          phone: pharmacy.phone,
        };
        firstResponses.push(response);
      }

      setMyRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                responses: [...(req.responses || []), ...firstResponses],
              }
            : req
        )
      );

      toast.success(`${firstBatchCount} pharmacies have responded`, {
        description: "Check your request for details",
      });
    }, 3000); // After 3 seconds

    // Second batch of responses (3 more)
    setTimeout(() => {
      const secondResponses: PharmacyResponse[] = [];

      for (let i = 3; i < 6; i++) {
        const pharmacy = nearbyPharmacies[i];
        const response: PharmacyResponse = {
          pharmacyName: pharmacy.name,
          response:
            responseTypes[Math.floor(Math.random() * responseTypes.length)],
          date: new Date().toLocaleDateString("es-ES"),
          time: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          distance: pharmacy.distance,
          address: pharmacy.address,
          phone: pharmacy.phone,
        };
        secondResponses.push(response);
      }

      setMyRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                responses: [...(req.responses || []), ...secondResponses],
              }
            : req
        )
      );

      toast.success("3 more pharmacies have responded", {
        description: "Check your request for details",
      });
    }, 8000); // After 8 seconds
  };

  const handleStatusChange = (
    id: string,
    status: "have" | "substitute" | "notSure" | "notHave"
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              responses: [
                ...(req.responses || []),
                {
                  pharmacyName: "My Pharmacy",
                  response: status,
                  date: new Date().toLocaleDateString("es-ES"),
                  time: new Date().toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }),
                },
              ],
            }
          : req
      )
    );
  };

  const handleResolve = (id: string, pharmacyName?: string) => {
    setMyRequests((prev) => prev.filter((req) => req.id !== id));
    toast.success(
      `Request resolved${pharmacyName ? ` with ${pharmacyName}` : ""}`,
      {
        description: "The request has been marked as resolved.",
      }
    );
  };

  const handleCancel = (id: string) => {
    setMyRequests((prev) => prev.filter((req) => req.id !== id));
    toast.success("Request cancelled", {
      description: "The request has been cancelled.",
    });
  };

  const handleNewRequest = (cnCode: string, drugPresentation: string) => {
    const newRequest: RequestData = {
      id: `my-${Date.now()}`,
      date: new Date().toLocaleDateString("es-ES"),
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      cnCode,
      drugPresentation,
      pharmacyName: "My Pharmacy",
      owner: "Me",
      address: "c/ oza 45 Madrid 36001",
      phone: "0000000",
      isMyRequest: true,
      responses: [],
    };

    setMyRequests((prev) => [newRequest, ...prev]);
    setIsModalOpen(false);

    // Generate automatic responses
    generateResponses(newRequest.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-6">
        {activeTab === "all" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">All Requests</h1>

            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">No requests available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">My Requests</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="pharma-button-green"
              >
                <Plus size={18} /> New Request
              </button>
            </div>

            <div className="space-y-4">
              {myRequests.length > 0 ? (
                myRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onResolve={handleResolve}
                    onCancel={handleCancel}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No hay solicitudes disponibles
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="pharma-button-green mt-4"
                  >
                    <Plus size={18} /> Create New Request
                  </button>
                </div>
              )}
            </div>

            {myRequests.length > 0 &&
              myRequests.every((req) => (req.responses?.length || 0) === 0) && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">
                    Waiting for responses
                  </h2>
                  <p className="text-gray-500">
                    No pharmacies have responded yet
                  </p>
                </div>
              )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No messages available</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Settings coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* New urgent request notification */}
      <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <SheetContent className="w-full sm:max-w-md border-l-4 border-yellow-500">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="text-yellow-500" /> Urgent Request
            </SheetTitle>
          </SheetHeader>
          {newNotification && (
            <div className="mt-4">
              <RequestCard
                request={newNotification}
                onStatusChange={(id, status) => {
                  handleStatusChange(id, status);
                  setTimeout(() => setIsNotificationOpen(false), 1000);
                }}
                isNotification
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewRequest}
      />
    </div>
  );
};

export default Dashboard;
