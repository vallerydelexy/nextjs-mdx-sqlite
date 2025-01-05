import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BlogPagination({ page, totalPages }) {
  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`blog/?page=${page - 1}`} />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                href={`blog/?page=${pageIndex}`}
                isActive={pageIndex === page}
              >
                {pageIndex}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        { page < totalPages && <PaginationItem>
          <PaginationNext href={`blog/?page=${page + 1}`} />
        </PaginationItem>}
      </PaginationContent>
    </Pagination>
  );
}
