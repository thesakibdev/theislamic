import { FaUser } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "@/slices/authslice";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };
  return (
    <div className="p-[50px] text-center flex flex-col items-center bg-white/40 backdrop:blur-lg rounded-md">
      <div className="flex flex-col gap-4 items-center justify-center mb-10">
        <FaUser className="w-[80px] h-[80px] bg-primary text-white p-[6.5px] rounded-full" />
        <h1 className="text-5xl font-semibold">Login</h1>
        <p className="text-lg text-white">
          {`Don't have an account?`}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Register
          </span>
        </p>
      </div>
      <form className="w-[350px] flex flex-col gap-4" onSubmit={handleLogin}>
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
          Login
        </Button>
      </form>
    </div>
  );
}
