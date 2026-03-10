"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "@/utils/api";

interface Props {
  token: string | null;
  user: any;
}

const CreateListingPage: React.FC<Props> = ({ token, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files).slice(0, 5)); // Limit to 5 images
  };

  // Validate form
  const validate = () => {
    const { title, location, description } = formData;
    if (!title || !location || !description) {
      toast.error("Title, location, and description are required");
      return false;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("description", formData.description);
      if (formData.price) data.append("price", formData.price);

      images.forEach((img) => data.append("images", img));

      const res = await API.post("/listings/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Listing created successfully!");
        setFormData({ title: "", location: "", description: "", price: "" });
        setImages([]);
      } else {
        toast.error(res.data.message || "Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Experience Title"
          value={formData.title}
          onChange={handleChange}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <textarea
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
          className="p-3 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="number"
          name="price"
          placeholder="Price (optional)"
          value={formData.price}
          onChange={handleChange}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded"
        />
        <p className="text-sm text-gray-500">Max 5 images. JPG, PNG, JPEG, WEBP</p>

        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {images.map((img, idx) => (
              <span key={idx} className="bg-yellow-100 px-2 py-1 rounded text-sm">
                {img.name}
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;