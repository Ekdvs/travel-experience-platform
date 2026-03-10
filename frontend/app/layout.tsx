import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <AuthProvider>

          <Navbar />

          <main>
            {children}
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#22c55e",
                  color: "white",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                  color: "white",
                },
              },
            }}
          />

        </AuthProvider>

      </body>
    </html>
  );
}