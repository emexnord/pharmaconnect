import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Phone,
  MapPin,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PharmacyResponse {
  pharmacyName: string;
  response: "have" | "substitute" | "notSure" | "notHave";
  date: string;
  time: string;
  distance?: string;
  address?: string;
  phone?: string;
}

export interface RequestData {
  id: string;
  date: string;
  time: string;
  cnCode: string;
  drugPresentation: string;
  pharmacyName: string;
  owner: string;
  address: string;
  phone: string;
  status?: "have" | "substitute" | "notSure" | "notHave" | null;
  isMyRequest?: boolean;
  isUrgent?: boolean;
  responses?: PharmacyResponse[];
}

interface RequestCardProps {
  request: RequestData;
  onStatusChange?: (
    id: string,
    status: "have" | "substitute" | "notSure" | "notHave"
  ) => void;
  onResolve?: (id: string, pharmacyName?: string) => void;
  onCancel?: (id: string) => void;
  isNotification?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onStatusChange,
  onResolve,
  onCancel,
  isNotification = false,
}) => {
  const [status, setStatus] = useState<
    "have" | "substitute" | "notSure" | "notHave" | null
  >(request.status || null);
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<PharmacyResponse | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleStatusChange = (
    newStatus: "have" | "substitute" | "notSure" | "notHave"
  ) => {
    if (status) {
      toast("Response already submitted", {
        description: "You can't change your response once submitted.",
      });
      return;
    }

    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(request.id, newStatus);
      toast.success("Response submitted", {
        description: "Your response has been recorded.",
      });
    }
  };

  const handleResolve = () => {
    if (onResolve) {
      onResolve(request.id, selectedPharmacy?.pharmacyName);
      setShowDialog(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(request.id);
    }
  };

  const selectPharmacy = (pharmacy: PharmacyResponse) => {
    if (pharmacy.response === "have" || pharmacy.response === "substitute") {
      setSelectedPharmacy(pharmacy);
      setShowDialog(true);
    } else {
      toast.info("Can't select this pharmacy", {
        description:
          "You can only select pharmacies that have the medication or a substitute.",
      });
    }
  };

  // Get counts of each response type
  const responseCounts =
    request.responses?.reduce((acc, response) => {
      acc[response.response] = (acc[response.response] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  // Filter responses by type
  const hasResponses =
    request.responses?.filter((r) => r.response === "have") || [];
  const substituteResponses =
    request.responses?.filter((r) => r.response === "substitute") || [];

  // Get color based on response type
  const getResponseColor = (responseType: string) => {
    switch (responseType) {
      case "have":
        return "bg-green-500 text-white";
      case "substitute":
        return "bg-blue-500 text-white";
      case "notSure":
        return "bg-yellow-500 text-white";
      case "notHave":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // Get icon based on response type
  const getResponseIcon = (responseType: string) => {
    switch (responseType) {
      case "have":
        return <Check size={14} />;
      case "substitute":
        return <Check size={14} />;
      case "notSure":
        return <span className="font-bold text-xs">?</span>;
      case "notHave":
        return <X size={14} />;
      default:
        return null;
    }
  };

  // Get text based on response type
  const getResponseText = (responseType: string) => {
    switch (responseType) {
      case "have":
        return "I have it";
      case "substitute":
        return "Have substitute";
      case "notSure":
        return "Not sure";
      case "notHave":
        return "Don't have it";
      default:
        return "";
    }
  };

  return (
    <div
      className={`pharma-card ${
        request.isUrgent ? "border-l-4 border-yellow-500" : ""
      } ${isNotification ? "shadow-lg" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={16} />
            <span className="text-sm text-gray-500">{request.date}</span>
            <Clock className="text-gray-500 ml-2" size={16} />
            <span className="text-sm text-gray-500">{request.time}</span>
            {request.isUrgent && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle size={12} /> Urgent
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">CN:</span>
            <span className="text-sm">{request.cnCode}</span>
          </div>
        </div>

        <div className="mt-1">
          <div className="flex items-start gap-2">
            <FileText className="text-pharma-blue mt-1" size={16} />
            <span className="font-medium">{request.drugPresentation}</span>
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Users className="text-gray-500" size={16} />
            <span className="text-sm">
              {request.pharmacyName} - {request.owner}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-500" size={16} />
            <span className="text-sm">{request.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" size={16} />
            <span className="text-sm">{request.phone}</span>
          </div>
        </div>

        {/* Responses summary */}
        {(request.responses?.length || 0) > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-sm bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-full shadow-sm">
                  <MessageSquare size={14} />
                  <span>{request.responses?.length || 0} responses</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium">Responses from pharmacies</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {request.responses?.map((response, idx) => (
                    <div
                      key={idx}
                      className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {response.pharmacyName}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getResponseColor(
                            response.response
                          )}`}
                        >
                          {getResponseIcon(response.response)}
                          {getResponseText(response.response)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {response.date} - {response.time}
                      </div>
                      {response.distance && (
                        <div className="text-xs text-gray-500">
                          {response.distance} away
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {Object.entries(responseCounts).map(([responseType, count]) => (
              <div
                key={responseType}
                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getResponseColor(
                  responseType
                )}`}
              >
                {getResponseIcon(responseType)}
                <span>
                  {count} {getResponseText(responseType)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!request.isMyRequest ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange("have")}
            className={`pharma-button ${
              status === "have"
                ? "bg-green-500"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            } px-4 py-2 rounded-md flex items-center gap-2 ${
              status && status !== "have" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!!(status && status !== "have")}
          >
            <Check size={18} /> I Have It
          </button>
          <button
            onClick={() => handleStatusChange("substitute")}
            className={`pharma-button ${
              status === "substitute"
                ? "bg-blue-500"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            } px-4 py-2 rounded-md flex items-center gap-2 ${
              status && status !== "substitute"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!!(status && status !== "substitute")}
          >
            <Check size={18} /> I Have a Substitute
          </button>
          <button
            onClick={() => handleStatusChange("notSure")}
            className={`pharma-button ${
              status === "notSure"
                ? "bg-yellow-500"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            } px-4 py-2 rounded-md flex items-center gap-2 ${
              status && status !== "notSure"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!!(status && status !== "notSure")}
          >
            <span className="font-bold">?</span> Not Sure
          </button>
          <button
            onClick={() => handleStatusChange("notHave")}
            className={`pharma-button ${
              status === "notHave"
                ? "bg-red-500"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            } px-4 py-2 rounded-md flex items-center gap-2 ${
              status && status !== "notHave"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!!(status && status !== "notHave")}
          >
            <X size={18} /> I Don&apos;t Have It
          </button>
          <button className="pharma-button-outline ml-auto">
            Resolution History
          </button>
        </div>
      ) : (
        <>
          {/* Available pharmacies section for "My Requests" */}
          {(hasResponses.length > 0 || substituteResponses.length > 0) && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                Available at these pharmacies:
              </h3>
              <div className="space-y-2">
                {/* Pharmacies that have the product */}
                {hasResponses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-700">
                      Have the exact product:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hasResponses.map((response, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectPharmacy(response)}
                          className="bg-green-50 border border-green-200 rounded-md p-2 cursor-pointer hover:bg-green-100 transition-colors"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {response.pharmacyName}
                            </span>
                            <span className="text-green-700 text-sm">
                              {response.distance || "~2.3km"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {response.address || "Calle Example 123"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {response.phone || "123-456-789"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pharmacies that have substitutes */}
                {substituteResponses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-700">
                      Have substitutes available:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {substituteResponses.map((response, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectPharmacy(response)}
                          className="bg-blue-50 border border-blue-200 rounded-md p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {response.pharmacyName}
                            </span>
                            <span className="text-blue-700 text-sm">
                              {response.distance || "~3.1km"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {response.address || "Calle Example 456"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {response.phone || "987-654-321"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleResolve}
              className="pharma-button bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Check size={18} /> Resolve
            </button>
            <button
              onClick={handleCancel}
              className="pharma-button bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <X size={18} /> Cancel Request
            </button>
            <button className="pharma-button-outline ml-auto">
              Resolution History
            </button>
          </div>
        </>
      )}

      {/* Pharmacy selection dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve with this Pharmacy</DialogTitle>
            <DialogDescription>
              Are you sure you want to resolve your request with{" "}
              {selectedPharmacy?.pharmacyName}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedPharmacy && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="font-medium">
                  {selectedPharmacy.pharmacyName}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedPharmacy.address || "Calle Example 123"}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedPharmacy.phone || "123-456-789"}
                </div>
                <div className="text-sm flex items-center gap-1 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getResponseColor(
                      selectedPharmacy.response
                    )}`}
                  >
                    {getResponseText(selectedPharmacy.response)}
                  </span>
                  <span className="text-gray-500">
                    • {selectedPharmacy.distance || "~2.3km"} away
                  </span>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="pharma-button-outline"
              >
                Cancel
              </button>
              <button onClick={handleResolve} className="pharma-button-green">
                Confirm Resolution
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestCard;
