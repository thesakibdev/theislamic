import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-screen">
      <h1 className="text-4xl font-semibold">404 Not Found</h1>
      <Button
        onClick={() => navigate("/")}
        className="bg-primary text-white"
      >
        GO TO HOME
      </Button>
    </div>
  );
}
