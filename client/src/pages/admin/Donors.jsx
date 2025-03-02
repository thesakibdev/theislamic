import {
  useAddDonorMutation,
  useEditDonorMutation,
  useDeleteDonorMutation,
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
  dateOfBirth: "",
  typeOfDonation: "",
  designation: "",
  profession: "",
  companyName: "",
  country: "",
  street: "",
  city: "",
  avatar: null,
  avatarId: null,
  amount: null,
  isDetailsVisible: true,
  donateDate: "",
};

export default function Donors() {
  const [formData, setFormData] = useState(initialFormData);
  const [openAddDonorForm, setOpenAddDonorForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllDonorsQuery({
    page: currentPage,
    limit: 10,
  });

  const [addDonor] = useAddDonorMutation();
  const [editDonor] = useEditDonorMutation();
  const [deleteDonor] = useDeleteDonorMutation();

  const resetForm = () => {
    setFormData(initialFormData);
    setOpenAddDonorForm(false);
    setImageFile(null);
    setImageLoadingState(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    const donationAmount = Number(formData.amount);
    const updatedFormData = {
      name: formData.name,
      fatherName: formData.fatherName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      typeOfDonation: formData.typeOfDonation,
      designation: formData.designation,
      profession: formData.profession,
      companyName: formData.companyName,
      country: formData.country,
      street: formData.street,
      city: formData.city,
      amount: donationAmount,
      isDetailsVisible: formData.isDetailsVisible,
      avatar: uploadedImageUrl,
      avatarId: imagePublicId,
      donateDate: formData.donateDate,
    };
    console.log(updatedFormData);

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
      dateOfBirth: donor.dateOfBirth,
      typeOfDonation: donor.typeOfDonation,
      profession: donor.profession,
      designation: donor.designation,
      companyName: donor.companyName,
      street: donor.street,
      city: donor.city,
      country: donor.country,
      amount: donor.TotalDonation,
      avatar: donor.avatar,
      isDetailsVisible: donor.isDetailsVisible,
      donateDate: donor.donateDate,
    });
  };

  const handleDeleteDonor = async (donorId) => {
    console.log("Deleting Donor with ID:", donorId);
    try {
      // Show a confirmation dialog
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this verse? This action cannot be undone."
      );

      // If the user clicks "OK", proceed with the delete API call
      if (userConfirmed) {
        const deleteResponse = await deleteDonor(donorId).unwrap();
        refetch();
        toast.success(deleteResponse.message || "Verse deleted successfully");
      } else {
        // User canceled the action
        toast.info("Delete action canceled");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
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
      label: "Donor Date of Birth",
      name: "dateOfBirth",
      componentType: "input",
      type: "date",
      placeholder: "Enter Donor Date of Birth",
    },
    {
      label: "Type of Donation",
      name: "typeOfDonation",
      componentType: "input",
      type: "text",
      placeholder: "Enter Type of Donation",
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
      label: "Donation Amount",
      name: "amount",
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
    {
      label: "Donation Date",
      name: "donateDate",
      componentType: "input",
      type: "date",
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
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-semibold text-center">
              Honorable Donor List
            </h1>

            {isLoading ? (
              <p>Loading...</p>
            ) : data?.donors?.length > 0 ? (
              data?.donors?.map((donor) => (
                <div
                  key={donor.name}
                  className="border p-4 grid grid-cols-1 md:grid-cols-5 my-6 gap-5 rounded-md relative"
                >
                  <div className="md:col-span-1 overflow-hidden rounded-md">
                    {donor.avatar === "" ? (
                      <div className="w-full h-96 md:h-[200px] mx-auto bg-gray-300"></div>
                    ) : (
                      <div className="max-h-[400px] md:max-h-[200px] w-full object-fill">
                        <img
                          src={donor.avatar}
                          alt={donor.name}
                          className="rounded-md h-full w-full object-cover mx-auto md:mx-0"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xl md:text-2xl font-bold mb-2">
                        Name: {donor.name}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          className="bg-primary text-white"
                          onClick={() => handleEditDonor(donor)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteDonor(donor._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-y-3 gap-x-10">
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Profession:
                        </span>{" "}
                        {donor.profession}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Company:
                        </span>{" "}
                        {donor.companyName}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Designation:{" "}
                        </span>
                        {donor.designation}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Street:
                        </span>{" "}
                        {donor.street}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          City:
                        </span>{" "}
                        {donor.city}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Country:
                        </span>{" "}
                        {donor.country}
                      </p>
                      <p className="text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Total Donation:
                        </span>{" "}
                        {donor.TotalDonation}
                      </p>
                      <div className="donation-history flex gap-2 text-lg text-black/50">
                        <span className="font-semibold text-black/60">
                          Last Donation:
                        </span>{" "}
                        {donor?.donationHistory?.map((donation, index) => (
                          <div key={index}>{donation.amount}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No Donors Found</p>
            )}
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
                    onClick={() =>
                      setCurrentPage(() =>
                        currentPage > 2 ? 1 : currentPage + 2
                      )
                    }
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
