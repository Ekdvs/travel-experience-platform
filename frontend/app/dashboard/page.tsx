"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, LogOut, FileText } from "lucide-react";

import API from "@/utils/api";
import Loader from "@/components/Loader";
import ListingsPage from "@/components/ListingsPage";
import CreateListingPage from "@/components/CreateListingPage";

const sidebarItems = [
  { key: "dashboard", label: "My Listings", icon: FileText },
  { key: "create", label: "Add Listing", icon: Plus },
];

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setUser(res.data.data);
        else toast.error("Failed to load user");
      } catch (err) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router]);

  const handleLogout = async () => {
    try {
      await API.post("/users/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex bg-gray-100" >

      {/* ✅ Sidebar — always visible, not hidden on mobile */}
      <aside className="flex flex-col w-64 min-h-screen bg-yellow-100 shadow-md p-6 shrink-0">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Dashboard</h1>

        <ul className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <li
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-lg transition-colors
                  ${isActive
                    ? "bg-blue-100 text-blue-600 font-bold"
                    : "hover:bg-gray-200 text-black"
                  }`}
              >
                <Icon size={20} />
                {item.label}
              </li>
            );
          })}
        </ul>

        {/* Logout pinned at bottom */}
        <li
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 list-none mt-4"
        >
          <LogOut size={20} />
          Logout
        </li>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && <ListingsPage token={token} user={user} />}
        {activeSection === "create" && <CreateListingPage token={token} user={user} />}
      </main>
    </div>
  );
};

export default UserDashboard;