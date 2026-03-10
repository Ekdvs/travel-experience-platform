"use client";

import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import API from "@/utils/api";

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await API.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (res.data.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('/bglogin.jpg')] bg-cover bg-center flex items-center justify-center">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 h-full flex-col items-center justify-center gap-8 bg-black/50 p-10">
        <img src="/logo.png" alt="Travel Experience Logo" className="w-40 h-40 opacity-90" />

        <h1 className="text-5xl font-bold text-yellow-400">
          Travel Experience
        </h1>

        <p className="text-gray-200 text-center max-w-md">
          Join our platform and start sharing amazing travel experiences with
          the world.
        </p>

        <Link href="/login">
          <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg">
            Already have an account?
          </button>
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-black/50">

        <div className="w-[90%] max-w-md backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center gap-6 p-8">

          <h1 className="text-3xl font-semibold text-yellow-400">
            Register
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-5"
          >

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 rounded-lg p-3 bg-gray-800 text-white"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 rounded-lg p-3 bg-gray-800 text-white"
            />

            {/* PASSWORD */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 rounded-lg p-3 pr-12 bg-gray-800 text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative w-full">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-12 rounded-lg p-3 pr-12 bg-gray-800 text-white"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold"
            >
              <UserPlus size={20} />
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          <p className="text-gray-300 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-400">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;