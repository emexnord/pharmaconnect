import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cnCode: string, drugPresentation: string) => void;
}

const NewRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
}: NewRequestModalProps) => {
  const [cnCode, setCnCode] = useState("");
  const [drugPresentation, setDrugPresentation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnCode || !drugPresentation) {
      toast.error("All fields are required", {
        description: "Please fill in all the required fields.",
      });
      return;
    }

    onSubmit(cnCode, drugPresentation);
    clearFields();
    toast.success("Request published", {
      description: "Your request has been published successfully.",
    });
  };

  const clearFields = () => {
    setCnCode("");
    setDrugPresentation("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">New Request</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="cnCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CN Code
            </label>
            <input
              id="cnCode"
              type="text"
              value={cnCode}
              onChange={(e) => setCnCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter CN code"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="drugPresentation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Drug Presentation
            </label>
            <input
              id="drugPresentation"
              type="text"
              value={drugPresentation}
              onChange={(e) => setDrugPresentation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter drug name and dosage"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={clearFields}
              className="pharma-button-outline"
            >
              Clear Fields
            </button>
            <button
              type="button"
              onClick={onClose}
              className="pharma-button-outline"
            >
              Close
            </button>
            <button type="submit" className="pharma-button-green">
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
