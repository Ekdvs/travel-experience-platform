"use client";

import React, { useEffect, useState, useRef } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";
import {
  Edit3,
  Trash2,
  X,
  ImagePlus,
  MapPin,
  DollarSign,
  FileText,
  Tag
} from "lucide-react";
import Loader from "./Loader";

interface Listing {
  _id: string;
  title: string;
  location: string;
  description: string;
  price: string;
  image: string[];
}

interface Props {
  token: string | null;
  user: any;
}

const ListingsPage: React.FC<Props> = ({ token }) => {

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [editListing, setEditListing] = useState<Listing | null>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
  });

  const [keptImages, setKeptImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch Listings
  useEffect(() => {
    if (!token) return;

    const fetchListings = async () => {
      try {
        const res = await API.get("/listings/getListingByUserId", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setListings(res.data.data);
        }
      } catch {
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [token]);

  // Open Edit
  const openEdit = (listing: Listing) => {

    setEditListing(listing);

    setEditForm({
      title: listing.title,
      location: listing.location,
      description: listing.description,
      price: listing.price,
    });

    setKeptImages(listing.image || []);
    setNewImages([]);
    setPreviewUrls([]);
  };

  const closeEdit = () => {
    setEditListing(null);
    setKeptImages([]);
    setNewImages([]);
    setPreviewUrls([]);
  };

  const removeKeptImage = (index: number) => {
    setKeptImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || []);

    const total = keptImages.length + newImages.length + files.length;

    if (total > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditSubmit = async () => {

    if (!editListing || !token) return;

    setEditLoading(true);

    const formData = new FormData();

    formData.append("title", editForm.title);
    formData.append("location", editForm.location);
    formData.append("description", editForm.description);
    formData.append("price", editForm.price);

    keptImages.forEach((img) => formData.append("keptImages", img));

    newImages.forEach((img) => formData.append("images", img));

    try {

      const res = await API.put(
        `/listings/updateListingById/${editListing._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {

        setListings((prev) =>
          prev.map((l) =>
            l._id === editListing._id ? res.data.data : l
          )
        );

        toast.success("Listing updated");

        closeEdit();
      }

    } catch {
      toast.error("Failed to update listing");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {

    if (!confirm("Delete this listing?")) return;

    try {

      const res = await API.delete(
        `/listings/deleteListingById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {

        setListings((prev) =>
          prev.filter((l) => l._id !== id)
        );

        toast.success("Listing deleted");
      }

    } catch {
      toast.error("Delete failed");
    }
  };

  const totalImages = keptImages.length + newImages.length;

  if (loading) return <Loader />;

  return (
    <>
      {/* Listings Grid */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {listings.map((listing) => (

          <div
            key={listing._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >

            <div className="h-48 bg-gray-100 overflow-hidden rounded-t-xl">

              {listing.image?.[0] ? (

                <img
                  src={listing.image[0]}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="flex items-center justify-center h-full text-gray-300">
                  <ImagePlus size={40} />
                </div>

              )}
            </div>

            <div className="p-4">

              <h2 className="font-bold text-lg">
                {listing.title}
              </h2>

              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} />
                {listing.location}
              </p>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <DollarSign size={14} />
                  {listing.price}
                </span>

                <div className="flex gap-2">

                  <button
                    onClick={() => openEdit(listing)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Edit Modal */}

      {editListing && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white   max-w-lg rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center border-b p-4">

              <h2 className="font-bold text-lg">
                Edit Listing
              </h2>

              <button onClick={closeEdit}>
                <X />
              </button>

            </div>

            <div className="p-5 space-y-4">

              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Title"
              />

              <input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Location"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                rows={3}
              />

              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="w-full border p-2 rounded"
                placeholder="Price"
              />

              {/* Images */}

              <div>

                <div className="flex flex-wrap gap-2">

                  {keptImages.map((img, i) => (

                    <div key={i} className="relative">

                      <img
                        src={img}
                        className="w-[50px] h-[50px] object-cover rounded border"
                      />

                      <button
                        onClick={() => removeKeptImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={10} />
                      </button>

                    </div>

                  ))}

                  {previewUrls.map((img, i) => (

                    <div key={i} className="relative">

                      <img
                        src={img}
                        className="w-[50px] h-[50px] object-cover rounded border"
                      />

                      <button
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={10} />
                      </button>

                    </div>

                  ))}

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={totalImages >= 5}
                  className="mt-3 w-full border-dashed border-2 border-gray-300 py-2 rounded hover:border-blue-400"
                >
                  Add Images
                </button>

              </div>

            </div>

            <div className="flex gap-3 p-4 border-t">

              <button
                onClick={closeEdit}
                className="flex-1 border rounded py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSubmit}
                className="flex-1 bg-blue-600 text-white rounded py-2"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
};

export default ListingsPage;