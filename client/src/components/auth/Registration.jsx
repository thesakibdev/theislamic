import { FaUser } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRegisterMutation } from "../../slices/authslice";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  name: "",
  email: "",
  password: "",
};

export default function Registration() {
  const [register] = useRegisterMutation();
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const registerResponse = await register(formData).unwrap();
      toast.success(registerResponse.message);
      setFormData(initialFormData);
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="p-[50px] text-center flex flex-col items-center rounded-md backdrop:blur-lg bg-white/30">
      <div className="flex flex-col gap-4 items-center justify-center mb-10">
        <FaUser className="w-[80px] h-[80px] bg-primary text-white p-[6.5px] rounded-full" />
        <h1 className="text-5xl font-semibold">Registration</h1>
      </div>
      <form className="w-[350px] flex flex-col gap-4" onSubmit={handleRegister}>
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
