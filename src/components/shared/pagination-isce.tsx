"use client";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
  page: number;
  limit: number;
  hrefPrefix: string;
}
export function PaginationISCE({
  hasNextPage,
  hasPrevPage,
  total,
  page,
  limit,
  hrefPrefix,
}: PaginationControlsProps) {
  const router = useRouter();
  const totalPages = Math.ceil(total / Number(limit));
  return (
    <Pagination className="py-5">
      <PaginationContent>
        <div className="mr-2">
          Page {page} / {totalPages}
        </div>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            if (Number(page) !== 1) {
              router.push(`${hrefPrefix}?page=1&limit=${limit}`);
            }
          }}
          disabled={Number(page) <= 1}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            router.push(
              `${hrefPrefix}?page=${Number(page) - 1}&limit=${limit}`
            );
          }}
          disabled={!hasPrevPage}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            router.push(
              `${hrefPrefix}?page=${Number(page) + 1}&limit=${limit}`
            );
          }}
          disabled={!hasNextPage}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            if (Number(page) !== totalPages) {
              router.push(`${hrefPrefix}?page=${totalPages}&limit=${limit}`);
            }
          }}
          disabled={Number(page) === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </PaginationContent>
    </Pagination>
  );
}
