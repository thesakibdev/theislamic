import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function EmailVerify() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Button onClick={() => (window.location.href = "/index")}>
        Go to Index Page
      </Button>
    </div>
  );
}
