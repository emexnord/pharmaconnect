import { useState } from "react";
import { toast } from "sonner";

interface RegistrationFormProps {
  onComplete: () => void;
}

const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [step, setStep] = useState<"key" | "details">("key");
  const [registrationKey, setRegistrationKey] = useState("");
  const [formData, setFormData] = useState({
    pharmacyName: "",
    soeCode: "",
    address: "",
    city: "",
    postalCode: "",
    phone1: "",
    phone2: "",
  });

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationKey) {
      toast.error("Registration key is required");
      return;
    }

    // Simulate key validation
    if (
      registrationKey === "12345" ||
      registrationKey.toLowerCase() === "test"
    ) {
      // Auto-fill form for demo purposes
      setFormData({
        pharmacyName: "Farmacia Central",
        soeCode: "SOE-28001",
        address: "Calle Mayor 25",
        city: "Madrid",
        postalCode: "28001",
        phone1: "914567890",
        phone2: "654321098",
      });
      setStep("details");

      toast.success("Registration key validated", {
        description: "Form has been pre-filled for demonstration purposes.",
      });
    } else {
      toast.error("Invalid registration key", {
        description:
          "Please enter a valid registration key or use 'test' for demo.",
      });
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    const requiredFields = [
      "pharmacyName",
      "soeCode",
      "address",
      "city",
      "postalCode",
      "phone1",
    ] as const;
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("Missing required fields", {
        description: `Please fill in all required fields.`,
      });
      return;
    }

    // Simulate successful registration
    toast.success("Registration successful", {
      description: "Your pharmacy has been registered successfully.",
    });
    onComplete();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFillFromGoogle = () => {
    toast("Location access requested", {
      description: "Simulating Google Maps integration for address auto-fill.",
    });

    // Simulate auto-fill from Google Maps
    setTimeout(() => {
      setFormData({
        ...formData,
        address: "Calle de Atocha 27",
        city: "Madrid",
        postalCode: "28012",
      });
      toast.success("Address auto-filled", {
        description: "Address information has been auto-filled successfully.",
      });
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      {step === "key" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Register Your Pharmacy
          </h2>
          <p className="text-center text-gray-600">
            New installation detected. Enter your registration key to continue.
          </p>

          <form onSubmit={handleKeySubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={registrationKey}
                onChange={(e) => setRegistrationKey(e.target.value)}
                placeholder="Enter registration key"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pharma-green"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hint: Use &apos;test&apos; as a key for demo purposes
              </p>
            </div>

            <div>
              <button type="submit" className="w-full pharma-button-green py-3">
                Continue
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Pharmacy Details
          </h2>
          <p className="text-center text-gray-600">
            Complete your pharmacy information
          </p>

          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pharmacy Name *
                </label>
                <input
                  type="text"
                  name="pharmacyName"
                  value={formData.pharmacyName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SOE Code *
                </label>
                <input
                  type="text"
                  name="soeCode"
                  value={formData.soeCode}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-full">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleFillFromGoogle}
                    className="text-xs text-pharma-green hover:underline"
                  >
                    Get from Google Maps
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 1 *
                </label>
                <input
                  type="tel"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 2 *
                </label>
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" className="w-full pharma-button-green py-3">
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
