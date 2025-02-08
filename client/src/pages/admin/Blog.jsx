import ImageUploader from "@/components/common/imageUploader";

import { useState, useRef, useEffect } from "react";

import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";

import RTE from "../../components/common/RTE";
import { Input } from "@/components/ui/input";

import {
  useAddBlogMutation,
  useEditBlogMutation,
} from "../../slices/admin/blog";
import { useSelector } from "react-redux";

const initialFormData = {
  title: "",
  description: {},
  thumbnail: null,
  thumbnailId: "",
  shortDesc: "",
  metaTitle: "",
  metaDesc: "",
  metaKeyword: "",
  metaUrl: "",
  author: "",
};

export default function Blog() {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { user } = useSelector((state) => state.user);
  console.log(user);
  console.log(user.id);

  const [addBlog] = useAddBlogMutation();
  const [editBlog] = useEditBlogMutation();

  const RTERef = useRef(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedImageUrl("");
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
      formData.metaTitle.trim() !== "" &&
      formData.metaDesc.trim() !== "" &&
      formData.metaKeyword.trim() !== "" &&
      formData.metaUrl.trim() !== "" &&
      RTEContent !== "" &&
      uploadedImageUrl !== ""
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-center my-5">Blog</h1>

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
              <label htmlFor="metaTitle" className="text-lg text-semibold">
                Meta Title
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="metaTitle"
                placeholder="Meta Title"
                id="metaTitle"
                value={formData.metaTitle}
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

            <div className="">
              <label htmlFor="metaUrl" className="text-lg text-semibold">
                Meta Url
              </label>
              <Input
                className="w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary"
                type="text"
                name="metaUrl"
                placeholder="Meta Url"
                id="metaUrl"
                value={formData.metaUrl}
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
