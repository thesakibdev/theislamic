import React, { useState } from "react";
import { Calendar, Forward } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { 
  useGetApprovedCommentsQuery, 
  useAddCommentMutation 
} from "../../slices/comment";
import blogAvatar from "../../assets/auth-profile-bg.png";

const CommentSection = ({ blogId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [rating, setRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState({
    label: "",
    color: "",
  });

  // Fetch approved comments
  const { 
    data: commentsData, 
    isLoading: commentsLoading, 
    refetch 
  } = useGetApprovedCommentsQuery({ 
    blogId, 
    page: currentPage, 
    limit: 10 
  });

  // Add comment mutation
  const [addComment] = useAddCommentMutation();

  const ratingOptions = [
    {
      emoji: "😠",
      value: "Angry",
      color: "#FC5C65",
      label: "Angry",
    },
    {
      emoji: "😐",
      value: "Average",
      color: "#FA8231",
      label: "Average",
    },
    {
      emoji: "😐",
      value: "Normal",
      color: "#F7B731",
      label: "Normal",
    },
    {
      emoji: "😊",
      value: "Good",
      color: "#45AAF2",
      label: "Good",
    },
    {
      emoji: "😄",
      value: "Excellent",
      color: "#26DE81",
      label: "Excellent",
    },
  ];

  const onSubmit = async (data) => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        ...data,
        blogId,
        rating,
      };

      await addComment(commentData).unwrap();
      toast.success("Comment submitted successfully! It will be visible after admin approval.");
      reset();
      setRating(null);
      setSelectedRating({ label: "", color: "" });
      refetch(); // Refresh comments
    } catch (error) {
      toast.error(error?.data?.message || "Error submitting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (commentsLoading) {
    return (
      <div className="my-4">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-4">
        Comments ({commentsData?.pagination?.totalComments || 0})
      </h2>

      {/* Display Comments */}
      <div className="space-y-4 mb-8">
        {commentsData?.comments?.length > 0 ? (
          commentsData.comments.map((comment) => (
            <div key={comment._id} className="bg-slate-500/20 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={blogAvatar}
                    className="w-12 h-12 rounded-xl"
                    alt="avatar"
                  />
                  <div>
                    <h3 className="font-semibold">{comment.name}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.rating && (
                        <span className="text-sm text-gray-600">
                          • Rated: {comment.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-justify mt-4">{comment.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {commentsData?.pagination && commentsData.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!commentsData.pagination.hasPrev}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {commentsData.pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!commentsData.pagination.hasNext}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Comment Form */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add A Comment
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
            <div>
              {/* Name Field */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="block font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                    errors.name && "border-red-500"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="block font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                    errors.email && "border-red-500"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              {/* Website Field */}
              <div className="flex flex-col gap-2">
                <label className="block font-medium text-gray-700">
                  Website (optional)
                </label>
                <input
                  type="url"
                  {...register("website")}
                  className="w-full p-2 border rounded-md focus:border-primary outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Comment Field */}
            <div className="h-full flex flex-col gap-2">
              <label className="block font-medium text-gray-700">
                Comment *
              </label>
              <textarea
                {...register("comment", {
                  required: "Comment is required",
                  minLength: {
                    value: 10,
                    message: "Comment must be at least 10 characters",
                  },
                })}
                className={`w-full p-2 border rounded-md focus:border-primary outline-none flex-1 ${
                  errors.comment && "border-red-500"
                }`}
                placeholder="Your comment here..."
                rows="6"
              ></textarea>
              {errors.comment && (
                <span className="text-red-500 text-sm">{errors.comment.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Rating Section */}
            <div className="w-full bg-slate-300 px-3 py-2 rounded-lg">
              <label className="block font-medium text-gray-700 mb-2">
                Rate The Usefulness Of The Article *
              </label>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`p-2 transition-all duration-300 flex items-center gap-1 text-lg bg-slate-200 rounded-lg hover:bg-slate-300 ${
                      selectedRating.label === option.label
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => {
                      setRating(option.value);
                      setSelectedRating({
                        label: option.label,
                        color: option.color,
                      });
                    }}
                  >
                    <span>{option.emoji}</span>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "💬 Send Comment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection; 