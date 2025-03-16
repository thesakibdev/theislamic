import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllDonorsQuery } from "../../slices/admin/donor";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DonorPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllDonorsQuery({
    page: currentPage,
    limit: 10,
  });

  const handlePaginationNext = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaginationPrev = () => {
    setCurrentPage(() => (currentPage == 1 ? 1 : currentPage - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="pt-[4.5rem] md:pt-40 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-semibold text-center">
            Honorable Donors
          </h1>

          {isLoading ? (
            <p>Loading...</p>
          ) : data?.donors?.length > 0 ? (
            data?.donors?.map((donor) => (
              <div
                id="Donor"
                key={donor.name}
                className="border p-4 flex flex-col md:flex-row my-6 gap-5 rounded-md relative"
              >
                <div className="w-full md:max-w-[190px] md:w-1/4 overflow-hidden rounded-md">
                  {donor.avatar === "" ? (
                    <div className="w-full h-96 md:h-[200px] mx-auto bg-gray-300"></div>
                  ) : (
                    <div
                      className="h-96 md:h-[220px] w-full bg-cover bg-center rounded-md"
                      style={{ backgroundImage: `url(${donor.avatar})` }}
                    ></div>
                  )}
                </div>
                <div className="w-full md:w-3/4">
                  <p className="text-xl md:text-2xl font-bold mb-2 md:mt-5">
                    Name: {donor.name}
                  </p>
                  <div className="flex gap-y-3 gap-x-5 ">
                    <div className="w-1/2 flex flex-col gap-y-3">
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Profession:
                        </span>{" "}
                        {donor.profession}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Designation:{" "}
                        </span>
                        {donor.designation}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          City:
                        </span>{" "}
                        {donor.city}
                      </p>
                    </div>
                    <div className="w-1/2 flex flex-col gap-y-3">
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Company:
                        </span>{" "}
                        {donor.companyName}
                      </p>

                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Street:
                        </span>{" "}
                        {donor.street}
                      </p>

                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Country:
                        </span>{" "}
                        {donor.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Donors Found</p>
          )}
        </div>
        <div className="flex justify-center">
          <Pagination className="px-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-label="Go to previous page"
                  onClick={handlePaginationPrev}
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                  disabled={currentPage == 1}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                  onClick={() =>
                    setCurrentPage(() =>
                      currentPage > 2 ? 1 : currentPage + 2
                    )
                  }
                >
                  Skip
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  aria-label="Go to next page"
                  onClick={handlePaginationNext}
                  className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}
