"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/utils/api";
import ImageSlider from "@/components/ImageSlider";
import moment from "moment";
import { Heart, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

const ListingDetails = () => {

  const { id } = useParams();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchListing = async () => {
    try {
      const res = await API.get(`/listings/getById/${id}`);
      console.log("data",res.data.data);
      setListing(res.data.data);
    } catch (error:any) {
      toast.error("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  // LIKE
  const handleLike = async () => {
    try {
      const res = await API.post(`/listings/like/${id}`);

      toast.success(res.data.message || "Liked successfully");

      fetchListing();

    } catch (error:any) {

      toast.error(
        error?.response?.data?.message || "Error liking listing"
      );

    }
  };

  // SAVE
  const handleSave = async () => {
    try {

      const res = await API.post(`/listings/save/${id}`);

      toast.success(res.data.message || "Listing saved!");

    } catch (error:any) {

      toast.error(
        error?.response?.data?.message || "Error saving listing"
      );

    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* IMAGE SLIDER */}
      <ImageSlider images={listing.image} />

      <h1 className="text-3xl font-bold mt-6">
        {listing.title}
      </h1>

      <p className="text-gray-500">
        {listing.location}
      </p>

      <p className="text-sm text-gray-400 mt-1">
        Posted by {listing.creator?.name} • {moment(listing.createdAt).fromNow()}
      </p>

      <div className="flex gap-4 mt-4">

        <button
          onClick={handleLike}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <Heart size={18}/>
          Like ({listing.likes?.length || 0})
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Bookmark size={18}/>
          Save
        </button>

      </div>

      <div className="mt-6">

        <h2 className="text-xl font-semibold mb-2">
          Description
        </h2>

        <p className="text-gray-700 leading-relaxed">
          {listing.description}
        </p>

      </div>

    </div>
  );
};

export default ListingDetails;