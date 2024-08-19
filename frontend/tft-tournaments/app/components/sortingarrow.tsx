import { FaChevronUp, FaChevronDown } from "react-icons/fa";

type SortArrowProps = {
    sortOrder: "asc" | "desc" | undefined;
  };
  
export default function SortArrow({ sortOrder }: SortArrowProps) {
return (
    <>
    {sortOrder === "asc" && (
        <div className="ml-2">
        <FaChevronUp />
        </div>
    )}
    {sortOrder === undefined && (
        <div className="ml-2 text-whitish">
        <FaChevronDown />
        </div>
    )}
    {sortOrder === "desc" && (
        <div className="ml-2">
        <FaChevronDown />
        </div>
    )}
    </>
);
}