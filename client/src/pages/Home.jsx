import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const roles = ["admin", "creator", "editor"];

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <h1>Home</h1>

      {isAuthenticated && roles.includes(user.role) && (
        <Button onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
      )}

      <Button onClick={() => navigate("/login")}>Log In</Button>
    </div>
  );
}
