import ImageUploader from "@/components/common/imageUploader";

import { useState, useRef, useEffect } from "react";

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

const initialFormData = {
  title: "",
  description: {},
  thumbnail: null,
  thumbnailId: "",
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
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useSelector((state) => state.user);

  const [addBlog] = useAddBlogMutation();
  const [editBlog] = useEditBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const {
    data: blogs,
    isLoading,
    error,
  } = useGetAllBlogsQuery({
    page: currentPage,
    limit: 6,
  });

  const RTERef = useRef(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageLoadingState(false);
    setCurrentEditedId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const RTEContent = RTERef.current.getContent();

    const updatedFormData = {
      ...formData,
      description: RTEContent,
      thumbnail: uploadedImageUrl,
      thumbnailId: imagePublicId,
      author: user.id,
    };

    try {
      if (currentEditedId !== null) {
        const editResponse = await editBlog({
          id: currentEditedId,
          ...updatedFormData,
        }).unwrap();
        toast.success(editResponse.message || "Blog updated successfully!");
        setCurrentEditedId(null);
        resetForm();
      } else {
        const addResponse = await addBlog(updatedFormData).unwrap();
        if (addResponse.error) {
          toast.error(addResponse.error.message);
        } else {
          toast.success(addResponse.message || "Blog added successfully!");
          resetForm();
        }
      }
    } catch (error) {
      // Extract and display server error message or default message
      const errorMessage = error.data?.message || "Error submitting data!";
      console.error("Error submitting data:", error);
      toast.error(errorMessage);
    }
  };

  const isFormValid = () => {
    const RTEContent = RTERef.current?.getContent().trim();
    return (
      formData.title.trim() !== "" &&
      formData.shortDesc.trim() !== "" &&
      formData.slug.trim() !== "" &&
      formData.metaDesc.trim() !== "" &&
      formData.metaKeyword.trim() !== "" &&
      RTEContent !== ""
    );
  };

  useEffect(() => {
    if (currentEditedId !== null) {
      RTERef.current?.setContent(formData.description || "");
    } else {
      RTERef.current?.setContent("");
    }
  }, [currentEditedId, formData.description]);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleDeleteBlog = async (id) => {
    try {
      // Show a confirmation dialog
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this verse? This action cannot be undone."
      );

      // If the user clicks "OK", proceed with the delete API call
      if (userConfirmed) {
        const deleteResponse = await deleteBlog({
          id,
        }).unwrap();
        toast.success(deleteResponse.message || "Blog deleted successfully");
      } else {
        // User canceled the action
        toast.info("Delete action canceled");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    console.log("Blogs Data:", blogs);
  }, [blogs]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load blogs.</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-center my-5">Blog</h1>

      <div className="my-10 flex gap-3">
        {blogs?.map((blog) => (
          <div className="border rounded-md p-6" key={blog._id}>
            <h1>{blog.title}</h1>
            <h2>{blog.shortDesc}</h2>
            <h3>{blog.slug}</h3>
            <h4>{blog.metaDesc}</h4>

            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setCurrentEditedId(blog._id);
                  setFormData({
                    title: blog.title || "",
                    shortDesc: blog.shortDesc || "",
                    slug: blog.slug || "",
                    metaDesc: blog.metaDesc || "",
                    metaKeyword: blog.metaKeyword || "",
                    metaUrl: blog.metaUrl || "",
                    description: blog.description || "",
                  });
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBlog(blog._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

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

      <div className="py-6 mt-5">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="">
              <label htmlFor="title" className="text-lg text-semibold">
                Title
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="title"
                placeholder="Title"
                id="title"
                value={formData.title}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="shortDesc" className="text-lg text-semibold">
                Short Description
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="shortDesc"
                placeholder="Short Description"
                id="shortDesc"
                value={formData.shortDesc}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="slug" className="text-lg text-semibold">
                Slug
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="slug"
                placeholder="Slug"
                id="slug"
                value={formData.slug}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="metaDesc" className="text-lg text-semibold">
                Meta Description
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="metaDesc"
                placeholder="Meta Description"
                id="metaDesc"
                value={formData.metaDesc}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>

            <div className="">
              <label htmlFor="metaKeyword" className="text-lg text-semibold">
                Meta Keyword
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="metaKeyword"
                placeholder="Meta Keyword"
                id="metaKeyword"
                value={formData.metaKeyword}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-10">
            <label htmlFor="title">Description</label>

            <RTE
              onInit={(evt, editor) => (RTERef.current = editor)}
              initialValue={formData.description}
            />
          </div>
          <Button
            type="submit"
            className="mt-5 w-full"
            disabled={!isFormValid()}
          >
            {currentEditedId !== null ? "Edit Blog" : "Add Blog"}
          </Button>
        </form>
      </div>
    </div>
  );
}
