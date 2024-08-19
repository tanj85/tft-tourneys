"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { generatePagination } from "../data/utils";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="my-4 z-50 relative">
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={index} // Use index as key because `page` could be "..."
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  return isActive || position === "middle" ? (
    <div
      className={`
  flex h-10 w-10 items-center justify-center text-sm border
  ${position === "first" || position === "single" ? "rounded-l-md" : ""}
  ${position === "last" || position === "single" ? "rounded-r-md" : ""}
  ${isActive ? "z-10 bg-lightest-purple" : ""}
  ${!isActive && position !== "middle" ? "hover:bg-active-purple cursor-pointer" : ""}
  ${position === "middle" ? "text-gray-300" : ""}
`}
    >
      {page}
    </div>
  ) : (
    <Link
      href={href}
      className={`
        flex h-10 w-10 items-center justify-center text-sm border
        ${position === "first" || position === "single" ? "rounded-l-md" : ""}
        ${position === "last" || position === "single" ? "rounded-r-md" : ""}
        ${isActive ? "z-10bg-lightest-purple" : ""}
        hover:bg-active-purple cursor-pointer
      `}
    >
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const icon =
    direction === "left" ? (
      <FaChevronLeft className="w-4" />
    ) : (
      <FaChevronRight className="w-4" />
    );

  return isDisabled ? (
    <div
      className={`
              ${isDisabled ? "pointer-events-none text-gray-400 cursor-not-allowed" : "cursor-pointer"} 
              ${direction === "left" ? "mr-2 md:mr-4 flex items-center" : "ml-2 md:ml-4 flex items-center"} 
            `}
    >
      {icon}
    </div>
  ) : (
    <Link
      className={`
        ${isDisabled ? "pointer-events-none text-slate-200 cursor-not-allowed" : "cursor-pointer"} 
        ${direction === "left" ? "mr-2 md:mr-4 flex items-center" : "ml-2 md:ml-4 flex items-center"} 
      `}
      href={href}
    >
      {icon}
    </Link>
  );
}
