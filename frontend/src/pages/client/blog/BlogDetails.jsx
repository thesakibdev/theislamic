import { Calendar } from "lucide-react";
import { FaRegCommentDots, FaRegFolder, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useGetBlogByIdQuery } from "../../../slices/admin/blog";
import CommentSection from "../../../components/common/CommentSection";

export default function BlogDetails() {
  const { id } = useParams();

  const { data: blog } = useGetBlogByIdQuery({ id });

  return (
    <section className="pt-16">
      <div className="container px-4 mx-auto py-5">
        <div className="bg-primary-foreground/20 flex flex-col justify-center p-4 rounded-lg">
          <h2 className="text-3xl font-bold text-black mb-4">{blog?.title}</h2>
          <div className="overflow-hidden rounded-lg max-h-[500px] object-center">
            <img
              src={blog?.thumbnail}
              alt="Blog Thumbnail"
              className="object-cover w-full rounded-lg "
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-3 gap-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 inline-block" />
            <span className="text-sm">{blog?.createdAt.split("T")[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegCommentDots className="w-6 h-6 inline-block" />
            <span className="text-sm">Comments: {blog?.commentCount || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegFolder className="w-6 h-6 inline-block" />
            <span className="text-sm capitalize">
              Category: {blog?.category}
            </span>
          </div>
          {blog?.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <FaStar className="w-6 h-6 inline-block text-yellow-500" />
              <span className="text-sm">
                Rating: {blog?.averageRating}/5 ({blog?.totalRatings} ratings)
              </span>
            </div>
          )}
        </div>
        <div
          className="mt-5"
          dangerouslySetInnerHTML={{ __html: blog?.description }}
        ></div>

        {/* Comments Section */}
        <CommentSection blogId={id} />
      </div>
    </section>
  );
}
