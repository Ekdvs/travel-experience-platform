"use client";
const Pagination = ({ page, setPage, totalPages }: any) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default Pagination;