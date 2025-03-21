import {
  useAddDonorMutation,
  useEditDonorMutation,
  useDeleteDonorMutation,
  useGetAllDonorsQuery,
  useAddNewDonationHistoryMutation,
  useEditDonationHistoryMutation,
  useDeleteDonorHistoryMutation,
} from "../../slices/admin/donor";
import { FaAngleUp, FaRegEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/common/imageUploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

const initialDonationHistoryData = {
  amount: null,
  donateDate: "",
  typeOfDonation: "",
};

export default function Donors() {
  const [formData, setFormData] = useState(initialFormData);
  const [donationHistoryData, setDonationHistoryData] = useState(
    initialDonationHistoryData
  );

  const [openAddDonorForm, setOpenAddDonorForm] = useState(false);
  const [openHistory, setOpenHistory] = useState({});
  const [openDonationHistoryForm, setOpenDonationHistoryForm] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [donationHistoryId, setDonationHistoryId] = useState(null);
  const [donorId, setDonorId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, refetch } = useGetAllDonorsQuery({
    page: currentPage,
    limit: 5,
  });

  const [addDonor] = useAddDonorMutation();
  const [editDonor] = useEditDonorMutation();
  const [deleteDonor] = useDeleteDonorMutation();
  const [addNewDonationHistory] = useAddNewDonationHistoryMutation();
  const [editDonationHistory] = useEditDonationHistoryMutation();
  const [deleteDonorHistory] = useDeleteDonorHistoryMutation();

  const resetForm = () => {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl(null);
    setImagePublicId(null);
    setImageLoadingState(false);
    setOpenAddDonorForm(false);
    setDonationHistoryData(initialDonationHistoryData);
    setOpenDonationHistoryForm(false);
    setDonationHistoryId(null);
    setCurrentEditedId(null);
    console.log("Form Data Reset and Form Closed");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
          toast.success(addResponse.message || "Donor added successfully!");
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

  const handleDonationHistory = async (e) => {
    e.preventDefault();
    const donationAmount = Number(donationHistoryData.amount);
    const updatedDonationHistoryData = {
      amount: donationAmount,
      donateDate: donationHistoryData.donateDate,
      typeOfDonation: donationHistoryData.typeOfDonation,
    };
    console.log("updatedDonationHistoryData", updatedDonationHistoryData);
    console.log("donorId", donorId);
    console.log("donationHistoryId", donationHistoryId);
    try {
      if (donationHistoryId !== null) {
        const editResponse = await editDonationHistory({
          donorId,
          historyId: donationHistoryId,
          ...updatedDonationHistoryData,
        }).unwrap();
        resetForm();
        setOpenDonationHistoryForm(false);
        // Show success message from server
        toast.success(
          editResponse.message || "Donation history updated successfully!"
        );
      } else {
        const addResponse = await addNewDonationHistory({
          donorId,
          ...updatedDonationHistoryData,
        }).unwrap();
        // Show success or error messages based on the response
        if (addResponse.error) {
          setOpenDonationHistoryForm(false);
          console.log(addResponse.error);
          toast.error(addResponse.error.message);
        } else {
          setOpenDonationHistoryForm(false);
          toast.success(
            addResponse.message || "Donation history added successfully!"
          );
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
    setOpenHistory((prev) => ({ ...prev }));
  };

  const handleDeleteDonor = async (donorId) => {
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

  const handleDonorHistoryDelete = async (donorId, historyId) => {
    console.log("donorId", donorId);
    console.log("historyId", historyId);
    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this donation history? This action cannot be undone."
      );
      if (userConfirmed) {
        const deleteResponse = await deleteDonorHistory({
          donorId,
          historyId,
        }).unwrap();
        refetch();
        toast.success(
          deleteResponse.message || "Donation history deleted successfully"
        );
      } else {
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

  const toggleDonationHistory = (index) => {
    setOpenHistory((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    setOpenHistory((prev) => ({ ...prev }));
  }, [openAddDonorForm]);

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
              data?.donors?.map((donor, index) => (
                <div
                  key={donor.name}
                  className="border p-4 rounded-md mt-3 md:mt-5 relative"
                  onClick={() => toggleDonationHistory(index)}
                >
                  <div
                    id="Donor"
                    className="flex flex-col md:flex-row my-3 gap-5 rounded-md"
                  >
                    <div className="w-full md:max-w-[190px] md:w-1/4 overflow-hidden">
                      {donor.avatar === "" ? (
                        <div className="w-full h-96 md:h-[200px] mx-auto bg-gray-300"></div>
                      ) : (
                        <div
                          className="h-96 md:h-[220px] w-full bg-cover bg-center rounded-md"
                          style={{ backgroundImage: `url(${donor.avatar})` }}
                        ></div>
                      )}
                    </div>
                    <div className="w-full md:w-3/4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xl md:text-2xl font-bold mb-2">
                          Name: {donor.name}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            className="bg-primary text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDonor(donor);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDonor(donor._id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-y-3 gap-x-5 ">
                        <div className="w-1/2 flex flex-col gap-y-3">
                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              Profession:
                            </span>{" "}
                            {donor.profession}
                          </p>
                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              Designation:{" "}
                            </span>
                            {donor.designation}
                          </p>
                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              City:
                            </span>{" "}
                            {donor.city}
                          </p>
                          <div className="flex items-center gap-3 cursor-pointer group">
                            <p className="text-lg text-black/50">
                              <span className="font-semibold text-black/60">
                                Total Donation:
                              </span>{" "}
                              {donor.TotalDonation}
                            </p>
                            <FaAngleUp
                              className={`transition-transform ${
                                openHistory[index] ? "rotate-180" : ""
                              } group-hover:text-primary duration-300`}
                              alt="Arrow Down"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-y-3">
                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              Company:
                            </span>{" "}
                            {donor.companyName}
                          </p>

                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              Street:
                            </span>{" "}
                            {donor.street}
                          </p>

                          <p className="text-lg text-black/50">
                            <span className="font-semibold text-black/60">
                              Country:
                            </span>{" "}
                            {donor.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={openHistory[index] ? "block my-5" : "hidden"}>
                    <div className="flex justify-end">
                      <Button
                        className="text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetForm();
                          setDonorId(donor._id);
                          setOpenDonationHistoryForm(true);
                        }}
                      >
                        <FaPlus />
                        <span>Add New Donation</span>
                      </Button>
                    </div>
                    {donor?.donationHistory?.map((donation, index) => (
                      <div
                        key={index}
                        className="border p-4 rounded-md mt-3 flex justify-between cursor-pointer"
                      >
                        <div className="flex gap-5">
                          <p>
                            <span>Amount :</span> {donation.amount}
                          </p>
                          <p>
                            <span>Donate Date :</span> {donation.donateDate}
                          </p>
                          <p>
                            <span>Donation Type :</span>{" "}
                            {donation.typeOfDonation}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <div
                            className="bg-white border p-2 rounded-md text-black hover:bg-primary hover:text-white duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDonationHistoryForm(true);
                              setDonationHistoryId(donation._id);
                              setDonationHistoryData({
                                amount: donation.amount,
                                donateDate: donation.donateDate,
                                typeOfDonation: donation.typeOfDonation,
                              });
                            }}
                          >
                            <FaRegEdit />
                          </div>
                          <div
                            className="bg-red-500 border p-2 rounded-md text-white hover:bg-primary hover:text-black duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDonorHistoryDelete(donor._id, donation._id);
                            }}
                          >
                            <FaTrash />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Dialog
                    open={openDonationHistoryForm}
                    onOpenChange={(open) => {
                      if (!open) {
                        setOpenDonationHistoryForm(false);
                      }
                    }}
                  >
                    <DialogContent onClick={(event) => event.stopPropagation()}>
                      <DialogHeader>
                        <DialogTitle>Edit Donation History</DialogTitle>
                      </DialogHeader>

                      <form onSubmit={handleDonationHistory}>
                        <div className="">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            type="text"
                            id="amount"
                            name="amount"
                            value={donationHistoryData.amount}
                            onChange={(e) =>
                              setDonationHistoryData({
                                ...donationHistoryData,
                                amount: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            type="date"
                            id="date"
                            name="date"
                            value={donationHistoryData.donateDate}
                            onChange={(e) =>
                              setDonationHistoryData({
                                ...donationHistoryData,
                                donateDate: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="">
                          <Label htmlFor="typeOfDonation">Donation Type</Label>
                          <Input
                            type="text"
                            id="typeOfDonation"
                            name="typeOfDonation"
                            value={donationHistoryData.typeOfDonation}
                            onChange={(e) =>
                              setDonationHistoryData({
                                ...donationHistoryData,
                                typeOfDonation: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <Button className="mt-3 text-white">
                          {donationHistoryId ? "Update" : "Add"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            ) : (
              <p>No Donors Found</p>
            )}
          </div>
          <div className="flex justify-center mt-3 md:mt-5">
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
