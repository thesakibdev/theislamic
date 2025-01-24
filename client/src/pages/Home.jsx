import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10"> 
      <h1>Home</h1>

      <Button onClick={() => navigate("/login")}>Log In</Button>
    </div>
  );
}
