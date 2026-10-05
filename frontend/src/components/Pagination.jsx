export default function Pagination({ page, totalPages, total, onChange }) {
  if (!total) return null;

  return (
    <div className="pagination">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
