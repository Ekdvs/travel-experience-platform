"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import ListingCard from "@/components/ListingCard";
import Pagination from "@/components/Pagination";

const HomePage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch all listings
  const fetchListings = async (pageNumber: number) => {
    try {
      const res = await API.get(`/listings/all?page=${pageNumber}&limit=12`);
      setListings(res.data.data.listings);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.log("Error fetching listings:", error);
    }
  };

  // Search listings
  const searchListings = async (pageNumber: number) => {
    try {
      if (!search.trim()) {
        // If search is empty, just fetch all listings
        fetchListings(pageNumber);
        return;
      }

      const res = await API.get(
        `/listings/search?query=${encodeURIComponent(search)}&page=${pageNumber}&limit=12`
      );

      setListings(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.log("Error searching listings:", error);
    }
  };

  // Update listings whenever page or search changes
  useEffect(() => {
    if (search.trim() === "") {
      fetchListings(page);
    } else {
      searchListings(page);
    }
  }, [page, search]);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Travel Experiences</h1>

      {/* SEARCH BAR */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by title, location, or description..."
          className="border rounded-lg px-4 py-2 w-full sm:flex-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page when search changes
          }}
        />
        <button
          onClick={() => searchListings(1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Search
        </button>
      </div>

      {/* LISTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No listings found</p>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default HomePage;