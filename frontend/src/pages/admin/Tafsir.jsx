import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import RTE from "../../components/common/RTE";
import { Input } from "@/components/ui/input";
import {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetBySurahQuery
} from "../../slices/admin/tafsir";
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
  language: "",
  bookName: "",
  totalVerseNumber: "",
  content: "",
  note: "",
};

export default function Tafsir() {
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RTERef = useRef(null);

  const [addTafsir, { isLoading: isAddingTafsir }] = useAddTafsirMutation();
  const [editTafsir, { isLoading: isEditingTafsir }] = useEditTafsirMutation();
  const [deleteTafsir, { isLoading: isDeletingTafsir }] = useDeleteTafsirMutation();
  const {
    data: tafsirData,
    isLoading,
    error,
  } = useGetBySurahQuery({
    language: "bn",
    surahNumber: 1,
  });

  const tafsir = useMemo(() => tafsirData || [], [tafsirData]);

  const totalPages = useMemo(() => tafsirData?.totalPages || 1, [tafsirData]);

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

      const TotalVerseNumber = Number(formData.totalVerseNumber);
      const updatedFormData = {
        language: formData.language,
        tafseer: {
          bookName: formData.bookName,
          totalVerseNumber: TotalVerseNumber,
          content: RTEContent,
          note: formData.note,
        }
      };

      if (currentEditedId !== null) {
        const editResponse = await editTafsir({
          id: currentEditedId,
          ...updatedFormData,
        }).unwrap();
        toast.success(editResponse.message || "Tafsir updated successfully!");
        resetForm();
      } else {
        const addResponse = await addTafsir(updatedFormData).unwrap();
        toast.success(addResponse.message || "Tafsir added successfully!");
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
      formData.language.trim(),
      formData.bookName.trim(),
      formData.totalVerseNumber.trim(),
      RTEContent,
    ];

    return requiredFields.every((field) => field !== "" && field.length > 0);
  };

  // Set RTE content when editing a blog
  useEffect(() => {
    if (RTERef.current && formData.content) {
      RTERef.current.setContent(formData.content);
    }
  }, [formData.content]);


  const handleEditTafsir = (tafsir) => {
    if (!tafsir) return;

    setCurrentEditedId(tafsir._id);
    setFormData({
      language: tafsir.language || "",
      bookName: tafsir.bookName || "",
      totalVerseNumber: tafsir.totalVerseNumber || "",
      content: tafsir.content || "",
      note: tafsir.note || "",
    });


    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteTafsir = async (id) => {
    if (!id) return;

    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this tafsir? This action cannot be undone."
      );

      if (userConfirmed) {
        const deleteResponse = await deleteTafsir({ id }).unwrap();
        toast.success(deleteResponse.message || "Tafsir deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete tafsir");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-center my-8">
        Tafsir Management
      </h1>

      {/* Tafsir Cards */}
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
          Failed to load tafsir. {error.message || "Please try again later."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
            {tafsir.length > 0 ? (
              tafsir.map((tafsir) => (
                <Card key={tafsir._id} className="overflow-hidden border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">
                      {tafsir.language}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{tafsir.bookName}</p>
                    <p className="text-sm text-gray-600">{tafsir.totalVerseNumber}</p>
                    <div className="text-xs text-gray-500">
                      <p>Note: {tafsir.note}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => handleEditTafsir(tafsir)}
                      disabled={isEditingTafsir || isAddingTafsir}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteTafsir(tafsir._id)}
                      disabled={isDeletingTafsir}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">
                  No tafsir found. Create your first tafsir below.
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

      {/* Tafsir Form */}
      <div className="my-10 p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-medium mb-6">
          {currentEditedId ? "Edit Tafsir" : "Add New Tafsir"}
        </h2>

        <form onSubmit={onSubmit} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                name="language"
                id="language"
                value={formData.language}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
              >
                <option value="" className="bg-primary/50 text-white">Select Language</option>
                <option value="en" className="bg-primary/50 text-white">English</option>
                <option value="bn" className="bg-primary/50 text-white">Bengali</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="bookName" className="block text-sm font-medium">
                Book Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="bookName"
                id="bookName"
                placeholder="Book Name"
                value={formData.bookName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="totalVerseNumber" className="block text-sm font-medium">
                Total Verse Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="totalVerseNumber"
                id="totalVerseNumber"
                placeholder="Total Verse Number"
                value={formData.totalVerseNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="block text-sm font-medium">
                Note <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="note"
                id="note"
                placeholder="Note"
                value={formData.note}
                onChange={handleInputChange}
              />
            </div>

          </div>

          <div className="mt-8 space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Tafsir Content <span className="text-red-500">*</span>
            </label>
            <RTE
              onInit={(_, editor) => (RTERef.current = editor)}
              initialValue={formData.content}
            />
          </div>

          <div className="mt-8 flex space-x-4">
            <Button
              type="submit"
              className="px-6 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : currentEditedId
                  ? "Update Tafsir"
                  : "Publish Tafsir"}
            </Button>

            {currentEditedId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="text-white"
              >
                Cancel Edit Tafsir
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
