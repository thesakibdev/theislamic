import ImageUploader from "@/components/common/imageUploader";
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import RTE from "../../components/common/RTE";
import { Input } from "@/components/ui/input";
import {
  useAddBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
} from "../../slices/admin/blog";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

const initialFormData = {
  title: "",
  description: "",
  thumbnail: null,
  thumbnailId: null,
  category: "",
  shortDesc: "",
  slug: "",
  metaDesc: "",
  metaKeyword: "",
  author: "",
};

export default function Blog() {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const RTERef = useRef(null);

  const [addBlog, { isLoading: isAddingBlog }] = useAddBlogMutation();
  const [editBlog, { isLoading: isEditingBlog }] = useEditBlogMutation();
  const [deleteBlog, { isLoading: isDeletingBlog }] = useDeleteBlogMutation();
  const {
    data: blogsData,
    isLoading,
    error,
  } = useGetAllBlogsQuery({
    page: currentPage,
    limit: 6,
  });

  const blogs = useMemo(() => blogsData || [], [blogsData]);

  const totalPages = useMemo(() => blogsData?.totalPages || 1, [blogsData]);

  const [imageLoadingState, setImageLoadingState] = useState(false);

  // Handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setImagePublicId("");
    setImageLoadingState(false);
    setCurrentEditedId(null);
    if (RTERef.current) {
      RTERef.current.setContent("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const RTEContent = RTERef.current?.getContent() || "";

      const updatedFormData = {
        ...formData,
        description: RTEContent,
        thumbnail: uploadedImageUrl,
        thumbnailId: imagePublicId,
        author: user?.id,
      };

      if (currentEditedId !== null) {
        const editResponse = await editBlog({
          id: currentEditedId,
          ...updatedFormData,
        }).unwrap();
        toast.success(editResponse.message || "Blog updated successfully!");
        resetForm();
      } else {
        const addResponse = await addBlog(updatedFormData).unwrap();
        toast.success(addResponse.message || "Blog added successfully!");
        resetForm();
      }
    } catch (error) {
      const errorMessage = error.data?.message || "Error submitting data!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!RTERef.current) return false;

    const RTEContent = RTERef.current.getContent().trim();
    const requiredFields = [
      formData.title.trim(),
      formData.shortDesc.trim(),
      formData.slug.trim(),
      formData.metaDesc.trim(),
      formData.metaKeyword.trim(),
      RTEContent,
    ];

    return requiredFields.every((field) => field !== "" && field.length > 0);
  };

  // Set RTE content when editing a blog
  useEffect(() => {
    if (RTERef.current && formData.description) {
      RTERef.current.setContent(formData.description);
    }
  }, [formData.description]);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleEditBlog = (blog) => {
    if (!blog) return;

    setCurrentEditedId(blog._id);
    setFormData({
      title: blog.title || "",
      category: blog.category || "",
      shortDesc: blog.shortDesc || "",
      slug: blog.slug || "",
      metaDesc: blog.metaDesc || "",
      metaKeyword: blog.metaKeyword || "",
      description: blog.description || "",
    });

    // Set image data if available
    if (blog.thumbnail) {
      setUploadedImageUrl(blog.thumbnail);
    }
    if (blog.thumbnailId) {
      setImagePublicId(blog.thumbnailId);
    }

    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteBlog = async (id) => {
    if (!id) return;

    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      );

      if (userConfirmed) {
        const deleteResponse = await deleteBlog({ id }).unwrap();
        toast.success(deleteResponse.message || "Blog deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete blog");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-center my-8">
        Blog Management
      </h1>

      {/* Blog Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="h-64">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border rounded-md bg-red-50 text-red-500">
          Failed to load blogs. {error.message || "Please try again later."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {blog.thumbnail && (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-600">{blog.shortDesc}</p>
                    <div className="text-xs text-gray-500">
                      <p>Slug: {blog.slug}</p>
                      <p>Meta: {blog.metaDesc?.substring(0, 60)}...</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => handleEditBlog(blog)}
                      disabled={isEditingBlog || isAddingBlog}
                      className="text-white hover:text-black"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteBlog(blog._id)}
                      disabled={isDeletingBlog}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No blogs found. Create your first blog below.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center my-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Blog Form */}
      <div className="my-10 p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-medium mb-6">
          {currentEditedId ? "Edit Blog" : "Add New Blog"}
        </h2>

        <ImageUploader
          uploadEndpoint={`${baseUrl}/admin/blog/upload-image`}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageLoadingState={imageLoadingState}
          uploadedImageUrl={uploadedImageUrl}
          setImagePublicId={setImagePublicId}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          isEditMode={currentEditedId !== null}
        />

        <form onSubmit={onSubmit} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Blog Title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="shortDesc" className="block text-sm font-medium">
                Short Description <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="shortDesc"
                id="shortDesc"
                placeholder="Brief summary of the blog"
                value={formData.shortDesc}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="slug"
                id="slug"
                placeholder="URL-friendly name (e.g., my-blog-post)"
                value={formData.slug}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="metaDesc" className="block text-sm font-medium">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="metaDesc"
                id="metaDesc"
                placeholder="SEO description"
                value={formData.metaDesc}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="metaKeyword"
                className="block text-sm font-medium"
              >
                Meta Keywords <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="metaKeyword"
                id="metaKeyword"
                placeholder="Comma-separated keywords"
                value={formData.metaKeyword}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="category"
                id="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Blog Content <span className="text-red-500">*</span>
            </label>
            <RTE
              onInit={(_, editor) => (RTERef.current = editor)}
              initialValue={formData.description}
            />
          </div>

          <div className="mt-8 flex space-x-4">
            <Button
              type="submit"
              className="px-6 text-white hover:text-black"
              disabled={isSubmitting || imageLoadingState}
            >
              {isSubmitting
                ? "Saving..."
                : currentEditedId
                ? "Update Blog"
                : "Publish Blog"}
            </Button>

            {currentEditedId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
