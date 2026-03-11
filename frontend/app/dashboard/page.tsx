"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, LogOut, FileText, Menu, X } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        const res = await API.get("/users/me");
        if (res.data.success) setUser(res.data.data);
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
      await API.post("/users/logout");
    } catch {}
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white shadow-md p-6 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>

          {/* Close button mobile */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <ul className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;

            return (
              <li
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-lg transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-200"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-6 w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar (mobile menu button) */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={26} />
          </button>

          <h2 className="font-semibold">User Dashboard</h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === "dashboard" && (
            <ListingsPage token={token} user={user} />
          )}

          {activeSection === "create" && (
            <CreateListingPage token={token} user={user} />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;