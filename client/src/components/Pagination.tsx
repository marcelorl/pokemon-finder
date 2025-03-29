interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage 
}: PaginationProps) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </div>
      
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};
