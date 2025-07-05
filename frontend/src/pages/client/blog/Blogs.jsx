import { useState } from "react";
import { useGetAllBlogsQuery } from "../../../slices/admin/blog";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: blogs, isLoading, isError } = useGetAllBlogsQuery({
    page: currentPage,
    limit: 10,
  });
  console.log(blogs);
  return (
    <>
      <section className="pt-16 bg-slate-100 min-h-screen">
        <div className="container mx-auto p-4">
          <div>
            <h1 className="my-4 text-4xl font-semibold text-center">Blogs</h1>
          </div>
          {/* blog card */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {blogs?.map((blog, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 bg-white shadow-lg rounded-lg p-4"
                onClick={() => navigate(`/blog-details/${blog._id}`)}
              >
                <div className="object-cover w-full h-52">
                  <img
                    src={blog.thumbnail}
                    className="w-full h-52 object-cover rounded-md"
                    alt=""
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {blog.createdAt.split("T")[0]}
                  </span>
                  <span className="text-sm text-black bg-gray-200 rounded-md px-2 py-1">
                    {blog.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold">
                  {blog.title}
                </h2>
                <p className="text-base text-gray-400">
                  {blog.shortDesc.slice(0, 80) + "..."}
                </p>
                <div className="flex items-center gap-5">
                  {/* <img
                    src={blog.author.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  /> */}
                  <div className="flex flex-col justify-between items-start">
                    {/* <h2 className="text-base font-semibold">{blog.author.name}</h2> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
