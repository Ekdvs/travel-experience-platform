"use client";

import Link from "next/link";
import moment from "moment";

const ListingCard = ({ listing }: any) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      
      <img
        src={listing.image?.[0] || "/placeholder.jpg"}
        alt={listing.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-bold">{listing.title}</h2>

        <p className="text-gray-600 text-sm">{listing.location}</p>

        <p className="text-sm mt-2">
          {listing.description?.substring(0, 80)}...
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Posted by {listing.creator?.name} •{" "}
          {moment(listing.createdAt).fromNow()}
        </p>

        <Link href={`/listing/${listing._id}`}>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;