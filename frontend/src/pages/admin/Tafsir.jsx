import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import RTE from "../../components/common/RTE";
import { Input } from "@/components/ui/input";
import {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirQuery
} from "../../slices/admin/tafsir";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [parentId, setParentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("tafsir");

  const RTERef = useRef(null);

  const [addTafsir, { isLoading: isAddingTafsir }] = useAddTafsirMutation();
  const [editTafsir, { isLoading: isEditingTafsir }] = useEditTafsirMutation();
  const [deleteTafsir, { isLoading: isDeletingTafsir }] = useDeleteTafsirMutation();
  const {
    data: tafsirData,
    isLoading,
    error,
    refetch,
  } = useGetAllTafsirQuery({
    language: "bn",
    page: currentPage,
  });
  const tafsir = tafsirData?.data?.tafseer || [];


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
    setParentId(null);
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
      const editData = {
        bookName: formData.bookName,
        content: RTEContent,
        note: formData.note,
      }

      if (currentEditedId !== null) {
        const editResponse = await editTafsir({
          parentId: parentId,
          tafsirId: currentEditedId,
          formData: editData,
        }).unwrap();
        toast.success(editResponse.message || "Tafsir updated successfully!");
        resetForm();
        refetch();
      } else {
        const addResponse = await addTafsir(updatedFormData).unwrap();
        toast.success(addResponse.message || "Tafsir added successfully!");
        resetForm();
        refetch();
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
      formData.note.trim(),
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
    setParentId(tafsir.parentId);
    setFormData({
      language: tafsir.language || "",
      bookName: tafsir.bookName || "",
      totalVerseNumber: tafsir.totalVerseNumber || "",
      content: tafsir.content || "",
      note: tafsir.note || "",
    });

    // Switch to form tab
    setActiveTab("form");
    refetch();
  };

  const handleDeleteTafsir = async (parentId, tafsirId) => {
    if (!parentId || !tafsirId) return;

    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this tafsir? This action cannot be undone."
      );

      if (userConfirmed) {
        const deleteResponse = await deleteTafsir({ parentId, tafsirId }).unwrap();
        toast.success(deleteResponse.message || "Tafsir deleted successfully");
        refetch();
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
      <h1 className="text-2xl md:text-3xl font-semibold text-center my-4 md:my-8">
        Tafsir Management
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tafsir">All Tafsir</TabsTrigger>
          <TabsTrigger value="form">
            {currentEditedId ? "Edit Tafsir" : "Add New Tafsir"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tafsir" className="space-y-6">
          {/* Tafsir Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 my-4 md:my-5">
                {tafsir.length > 0 ? (
                  tafsir.map((tafsir) => (
                    <div className="bg-white p-4 rounded-lg shadow-md" key={tafsir._id}>
                      <h3 className="text-base md:text-lg font-semibold">{tafsir.surahName}</h3>
                      <p className="text-xs md:text-sm text-gray-600">Total Verse: {tafsir.totalVerseNumber}</p>
                      <p className="text-xs md:text-sm text-gray-600">{tafsir.bookName}</p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button onClick={() => handleEditTafsir(tafsir)} variant="outline" className="text-xs md:text-sm">Edit</Button>
                        <Button onClick={() => handleDeleteTafsir(tafsir.parentId, tafsir._id)} variant="destructive" className="text-xs md:text-sm">Delete</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">
                      No tafsir found. Create your first tafsir below.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          {/* Tafsir Form */}
          <div className="p-4 md:p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl md:text-2xl font-medium mb-4 md:mb-6">
              {currentEditedId ? "Edit Tafsir" : "Add New Tafsir"}
            </h2>

            <form onSubmit={onSubmit} className="mt-6 md:mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

              <div className="mt-6 md:mt-8 space-y-2">
                <label htmlFor="content" className="block text-sm font-medium">
                  Tafsir Content <span className="text-red-500">*</span>
                </label>
                <RTE
                  onInit={(_, editor) => (RTERef.current = editor)}
                  initialValue={formData.content}
                />
              </div>

              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
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
                    onClick={() => {
                      resetForm();
                      setActiveTab("tafsir");
                    }}
                    disabled={isSubmitting}
                    className="text-white"
                  >
                    Cancel Edit Tafsir
                  </Button>
                )}
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
