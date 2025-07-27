import React from "react";
import Logo from "./Logo";
import { MessageSquare, Settings } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <Logo />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("all")}
            className={
              activeTab === "all" ? "pharma-tab-active" : "pharma-tab-inactive"
            }
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={
              activeTab === "my" ? "pharma-tab-active" : "pharma-tab-inactive"
            }
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={
              activeTab === "messages"
                ? "pharma-tab-active"
                : "pharma-tab-inactive"
            }
          >
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>Messages</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={
              activeTab === "settings"
                ? "pharma-tab-active"
                : "pharma-tab-inactive"
            }
          >
            <div className="flex items-center gap-1">
              <Settings size={16} />
              <span>Settings</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
