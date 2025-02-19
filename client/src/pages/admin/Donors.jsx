import {
  useAddDonorMutation,
  useEditDonorMutation,
  useGetAllDonorsQuery,
} from "../../slices/admin/donor";
import { useState } from "react";
import CommonForm from "@/components/common/Form";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/common/imageUploader";

const initialFormData = {
  name: "",
  fatherName: "",
  email: "",
  phone: "",
  designation: "",
  profession: "",
  companyName: "",
  country: "",
  street: "",
  city: "",
  avatar: "",
  avatarId: "",
  TotalDonation: null,
  isDetailsVisible: true,
};

export default function Donors() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddDonorForm, setOpenAddDonorForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllDonorsQuery({
    page: currentPage,
    limit: 10,
  });

  const [addDonor] = useAddDonorMutation();
  const [editDonor] = useEditDonorMutation();

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddDonorForm(false);
    setImageFile(null);
    setImageLoadingState(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    const donationAmount = Number(formData.TotalDonation);
    const updatedFormData = {
      name: formData.name,
      fatherName: formData.fatherName,
      email: formData.email,
      phone: formData.phone,
      designation: formData.designation,
      profession: formData.profession,
      companyName: formData.companyName,
      country: formData.country,
      street: formData.street,
      city: formData.city,
      TotalDonation: donationAmount,
      isDetailsVisible: formData.isDetailsVisible,
      avatar: uploadedImageUrl,
      avatarId: imagePublicId,
    };

    try {
      if (currentEditedId !== null) {
        const editResponse = await editDonor({
          id: currentEditedId,
          ...updatedFormData,
        }).unwrap();
        resetForm();
        // Show success message from server
        toast.success(editResponse.message || "Donor updated successfully!");
      } else {
        const addResponse = await addDonor(updatedFormData).unwrap();
        // Show success or error messages based on the response
        if (addResponse.error) {
          toast.error(addResponse.error.message);
        } else {
          resetForm();
          toast.success(addResponse.message || "Donor added successfully!");
        }
      }
    } catch (error) {
      // Extract and display server error message or default message
      const errorMessage = error.data?.message || "Error submitting data!";
      console.error("Error submitting data:", error);
      toast.error(errorMessage);
    }
  };

  const handleEditDonor = (donor) => {
    setOpenAddDonorForm(true);
    setCurrentEditedId(donor._id);
    setFormData({
      name: donor.name,
      fatherName: donor.fatherName,
      email: donor.email,
      phone: donor.phone,
      profession: donor.profession,
      designation: donor.designation,
      companyName: donor.companyName,
      street: donor.street,
      city: donor.city,
      country: donor.country,
      TotalDonation: donor.TotalDonation,
      isDetailsVisible: donor.isDetailsVisible,
    });
  };

  const addDonorFormElements = [
    {
      label: "Donor Name",
      name: "name",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Name",
    },
    {
      label: "Donor Father Name",
      name: "fatherName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Father Name",
    },
    {
      label: "Donor Email",
      name: "email",
      componentType: "input",
      type: "email",
      placeholder: "Enter Donor Email",
    },
    {
      label: "Donor Phone",
      name: "phone",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Phone",
    },
    {
      label: "Donor profession",
      name: "profession",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor profession",
    },
    {
      label: "Donor Designation",
      name: "designation",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Designation",
    },
    {
      label: "Company Name",
      name: "companyName",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Company Name",
    },
    {
      label: "Street",
      name: "street",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor Street",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor City",
    },
    {
      label: "Country",
      name: "country",
      componentType: "input",
      type: "text",
      placeholder: "Enter Donor country",
    },
    {
      label: "Total Donation",
      name: "TotalDonation",
      componentType: "input",
      type: "text",
      placeholder: "Enter Total Donation Amount",
    },
    {
      label: "Is Donor Details Visible",
      name: "isDetailsVisible",
      componentType: "checkbox",
      type: "checkbox",
    },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    <>
      <div className="p-12">
        <div className="flex justify-end">
          <Button
            className="bg-primary text-white mr-10"
            onClick={() => {
              setOpenAddDonorForm(true);
              setCurrentEditedId(null); // Ensure we're in "Add" mode
              setFormData(initialFormData);
            }}
          >
            Add New Verse
          </Button>
        </div>

        <div className="container mx-auto px-4">
          <div className="">
            <h1 className="text-4xl font-semibold text-center">
              Honorable Donor List
            </h1>
            <div className="">
              {isLoading ? (
                <p>Loading...</p>
              ) : data?.donors?.length > 0 ? (
                data?.donors?.map((donor) => (
                  <div
                    key={donor.name}
                    className="border p-4 grid md:grid-cols-5 items-center justify-between my-6 gap-5 rounded-md"
                  >
                    {donor.avatar === "" ? (
                      <div className="w-[100px] h-[100px] mx-auto bg-gray-300"></div>
                    ) : (
                      <img
                        src={donor.avatar}
                        alt={donor.name}
                        className="rounded-md"
                      />
                    )}
                    <div className="md:col-span-3">
                      <p className="text-lg">
                        <span className="font-semibold">Name:</span>{" "}
                        {donor.name}
                      </p>
                      <div className="grid md:grid-cols-3">
                        <p className="text-lg">
                          <span className="font-semibold">Profession:</span>{" "}
                          {donor.profession}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">Company:</span>{" "}
                          {donor.companyName}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">Designation: </span>
                          {donor.designation}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">Street:</span>{" "}
                          {donor.street}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">City:</span>{" "}
                          {donor.city}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">Country:</span>{" "}
                          {donor.country}
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">Total Donation:</span>{" "}
                          Tk {donor.TotalDonation}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        className="bg-primary text-white hover:bg-primary/50 hover:text-black duration-500"
                        onClick={() => handleEditDonor(donor)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Donors Found</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Pagination className="px-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-label="Go to previous page"
                    onClick={() =>
                      setCurrentPage(() =>
                        currentPage == 1 ? 1 : currentPage - 1
                      )
                    }
                    className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                    disabled={currentPage == 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <Button
                    className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                    onClick={() => setCurrentPage(5)}
                  >
                    Skip
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    aria-label="Go to next page"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-primary hover:bg-green-400 cursor-pointer text-white"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <Sheet
        open={openAddDonorForm}
        onOpenChange={(isOpen) => setOpenAddDonorForm(isOpen)}
      >
        <SheetContent side="right" className="overflow-auto w-[90%]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Donor" : "Add Donor"}
            </SheetTitle>
          </SheetHeader>

          <ImageUploader
            uploadEndpoint={`${baseUrl}/donor/upload-image`}
            imageFile={imageFile}
            setImageFile={setImageFile}
            imageLoadingState={imageLoadingState}
            uploadedImageUrl={uploadedImageUrl}
            setImagePublicId={setImagePublicId}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <CommonForm
            allClasses={{
              formClass:
                "grid grid-cols-2 gap-5 mt-10 py-10 px-16 bg-primary-foreground rounded-lg shadow-lg",
              inputClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput resize-none outline-none focus:ring-2 focus:ring-primary",
              checkBoxClass:
                "border-white data-[state=checked]:bg-primary data-[state=checked]:text-white h-6 w-6 rounded-lg",
              textareaClass:
                "w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary",
              btnClass:
                "bg-primary text-white hover:text-black duration-300 mt-5 ",
            }}
            onSubmit={onSubmit}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId ? "Save Changes" : "Add Donor"}
            formControls={addDonorFormElements}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
