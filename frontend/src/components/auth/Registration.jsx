import { FaUser } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/slices/authslice";

const initialFormData = {
  name: "",
  phone: "",
  password: "",
  email: "",
  avatar: "",
  profession: "",
  companyName: "",
  designation: "",
  street: "",
  city: "",
  country: "",
};

export default function Registration() {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      email: formData.email,
      avatar: formData.avatar,
      profession: formData.profession,
      companyName: formData.companyName,
      designation: formData.designation,
      address: [
        {
          street: formData.street,
          city: formData.city,
          country: formData.country,
        },
      ],
    };
    console.log(updatedFormData);
    dispatch(registerUser(updatedFormData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/login");
      } else {
        toast.error(data?.payload?.message);
        console.log(data);
      }
    });
  };

  return (
    <div className="p-[50px] text-center flex flex-col items-center rounded-md backdrop:blur-lg bg-white/40">
      <div className="flex flex-col gap-4 items-center justify-center mb-10">
        <FaUser className="w-[80px] h-[80px] bg-primary text-white p-[6.5px] rounded-full" />
        <h1 className="text-5xl font-semibold">Registration</h1>
        <p className="text-lg text-white">
          You Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
      <form className="w-[500px] flex flex-col gap-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="name"
            value={formData.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Your Name"
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Your Phone Number"
          />
          <Input
            name="email"
            value={formData.email}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="email"
            placeholder="Enter Your Email"
          />
          <Input
            name="password"
            value={formData.password}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="password"
            placeholder="Enter Your Password"
          />
        </div>
        <h3 className="text-white font-bold  text-lg sm:text-xl md:text-2xl">
          Additional Data
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="profession"
            value={formData.profession}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Your profession"
          />
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Company Name"
          />
          <Input
            name="designation"
            value={formData.designation}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Your Designation"
          />
          <Input
            name="street"
            value={formData.street}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter Street"
          />
          <Input
            name="city"
            value={formData.city}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter city name"
          />
          <Input
            name="country"
            value={formData.country}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            type="text"
            placeholder="Enter country name"
          />
        </div>
        <Button
          type="submit"
          className="text-white hover:bg-primary-foreground duration-500 hover:text-primary"
        >
          Register
        </Button>
      </form>
    </div>
  );
}
