import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import RTE from "../../components/common/RTE";
import { Input } from "@/components/ui/input";
import {
  useAddTafsirMutation,
  useEditTafsirMutation,
  useDeleteTafsirMutation,
  useGetAllTafsirQuery,
} from "../../slices/admin/tafsir";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedTafsir, setSelectedTafsir] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("bn");

  const RTERef = useRef(null);

  const [addTafsir, { isLoading: isAddingTafsir }] = useAddTafsirMutation();
  const [editTafsir, { isLoading: isEditingTafsir }] = useEditTafsirMutation();
  const [deleteTafsir, { isLoading: isDeletingTafsir }] =
    useDeleteTafsirMutation();
  const { data, isLoading, error, refetch } = useGetAllTafsirQuery({
    language: selectedLanguage,
    page: currentPage,
  });
  const tafsir = data?.tafseer || [];
  console.log("tafsir", tafsir);

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
        },
      };
      const editData = {
        bookName: formData.bookName,
        content: RTEContent,
        note: formData.note,
      };

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
        const deleteResponse = await deleteTafsir({
          parentId,
          tafsirId,
        }).unwrap();
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

  const handleTafsirClick = (tafsir) => {
    setSelectedTafsir(tafsir);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTafsir(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-gray-300 p-4 rounded-lg">
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
            {/* Language Selection */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label htmlFor="languageFilter" className="text-sm font-medium text-gray-700">
                    Filter by Language:
                  </label>
                  <select
                    id="languageFilter"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="bn">Bengali</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {tafsir.length} tafsir found
                </div>
              </div>
            </div>

            {/* Tafsir List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 border rounded-md bg-red-50 text-red-500">
                Failed to load tafsir.{" "}
                {error.message || "Please try again later."}
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {tafsir.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {tafsir.map((tafsir) => (
                        <div
                          key={tafsir._id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                          onClick={() => handleTafsirClick(tafsir)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {tafsir.surahName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Total Verse: {tafsir.totalVerseNumber}</span>
                                <span>•</span>
                                <span>{tafsir.bookName}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTafsir(tafsir);
                                }}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTafsir(tafsir.parentId, tafsir._id);
                                }}
                                variant="destructive"
                                size="sm"
                                className="text-xs"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
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
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium"
                    >
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="language"
                      id="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-primary"
                    >
                      <option value="" className="bg-primary/50 text-white">
                        Select Language
                      </option>
                      <option value="en" className="bg-primary/50 text-white">
                        English
                      </option>
                      <option value="bn" className="bg-primary/50 text-white">
                        Bengali
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="bookName"
                      className="block text-sm font-medium"
                    >
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
                    <label
                      htmlFor="totalVerseNumber"
                      className="block text-sm font-medium"
                    >
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
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium"
                  >
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
                      className="text-primary"
                    >
                      Cancel Edit Tafsir
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tafsir Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selectedTafsir?.surahName}
              </DialogTitle>
              <DialogDescription>
                Tafsir Details and Information
              </DialogDescription>
            </DialogHeader>
            {selectedTafsir && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Book Name
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedTafsir.bookName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Total Verse Number
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedTafsir.totalVerseNumber}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">
                      {selectedTafsir.language}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Note
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedTafsir.note}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tafsir Content
                  </label>
                  <div 
                    className="text-sm text-gray-900 bg-gray-50 p-4 rounded max-h-60 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedTafsir.content }}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={closeDialog}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      closeDialog();
                      handleEditTafsir(selectedTafsir);
                    }}
                    className="text-white"
                  >
                    Edit Tafsir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
