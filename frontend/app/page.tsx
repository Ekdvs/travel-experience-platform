"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import ListingCard from "@/components/ListingCard";
import Pagination from "@/components/Pagination";

const HomePage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchListings = async (page: number) => {
    try {
      const res = await API.get(`/listings/all?page=${page}&limit=12`);

      setListings(res.data.data.listings);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListings(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Travel Experiences</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default HomePage;