import React, { useState } from "react";
import { Calendar, Check, X, Eye, Filter } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetAllCommentsQuery,
  useApproveCommentMutation,
  useRejectCommentMutation,
  useGetCommentStatsQuery,
  useUpdateAllBlogStatsMutation,
} from "../../slices/comment";
import { useSelector } from "react-redux";

const Comments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [blogFilter, setBlogFilter] = useState("");
  const { user } = useSelector((state) => state.auth);

  // Fetch comments
  const {
    data: commentsData,
    isLoading,
    refetch,
  } = useGetAllCommentsQuery({
    page: currentPage,
    limit: 20,
    status: statusFilter,
    blogId: blogFilter,
  });

  // Fetch stats
  const { data: stats } = useGetCommentStatsQuery();

  // Mutations
  const [approveComment] = useApproveCommentMutation();
  const [rejectComment] = useRejectCommentMutation();
  const [updateAllBlogStats] = useUpdateAllBlogStatsMutation();

  const handleApprove = async (commentId) => {
    try {
      await approveComment({
        id: commentId,
        approvedBy: user?._id,
      }).unwrap();
      toast.success("Comment approved successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Error approving comment");
    }
  };

  const handleReject = async (commentId) => {
    if (window.confirm("Are you sure you want to reject this comment?")) {
      try {
        await rejectComment({ id: commentId }).unwrap();
        toast.success("Comment rejected successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Error rejecting comment");
      }
    }
  };

  const handleUpdateAllStats = async () => {
    if (window.confirm("This will update comment counts and ratings for all blogs. Continue?")) {
      try {
        await updateAllBlogStats().unwrap();
        toast.success("All blog statistics updated successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Error updating blog statistics");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
        Approved
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
        Pending
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Comment Management
          </h1>
          <p className="text-gray-600">
            Manage and moderate comments from your blog posts
          </p>
        </div>
        <button
          onClick={handleUpdateAllStats}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Update All Blog Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.approved || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.data?.pending || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Comments</option>
              <option value="pending">Pending Only</option>
              <option value="approved">Approved Only</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blog Filter
            </label>
            <input
              type="text"
              placeholder="Blog ID (optional)"
              value={blogFilter}
              onChange={(e) => setBlogFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        </div>

        {commentsData?.comments?.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {commentsData.comments.map((comment) => (
              <div key={comment._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {comment.name}
                      </h3>
                      {getStatusBadge(comment.isApproved)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{comment.email}</span>
                      <span>•</span>
                      <span>{formatDate(comment.createdAt)}</span>
                      {comment.rating && (
                        <>
                          <span>•</span>
                          <span>Rated: {comment.rating}</span>
                        </>
                      )}
                    </div>

                    {comment.blogId && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">
                          Blog: {comment.blogId.title || comment.blogId}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-700 mb-3">{comment.comment}</p>

                    {comment.website && (
                      <div className="mb-3">
                        <a
                          href={comment.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {comment.website}
                        </a>
                      </div>
                    )}

                    {comment.isApproved && comment.approvedBy && (
                      <div className="text-sm text-gray-500">
                        Approved by: {comment.approvedBy.name} on{" "}
                        {formatDate(comment.approvedAt)}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex gap-2">
                    {!comment.isApproved && (
                      <button
                        onClick={() => handleApprove(comment._id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Approve Comment"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(comment._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Reject Comment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No comments found</p>
          </div>
        )}

        {/* Pagination */}
        {commentsData?.pagination && commentsData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {commentsData.pagination.totalPages} (
                {commentsData.pagination.totalComments} total comments)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!commentsData.pagination.hasPrev}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!commentsData.pagination.hasNext}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 