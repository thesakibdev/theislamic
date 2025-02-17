import { useLocation } from "react-router-dom";
import { useVerifyEmailQuery } from "../../slices/authslice";
import { Button } from "@/components/ui/button";

export default function EmailVerify() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { data, error, isLoading } = useVerifyEmailQuery(token, { skip: !token });

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {isLoading && <h2 className="text-xl font-bold">Verifying...</h2>}
      {error && <p className="text-red-500">Verification failed!</p>}
      {data && <p className="text-green-500">{data.message}</p>}

      <Button onClick={() => window.location.href = "/index"}>Go to Index Page</Button>
    </div>
  );
}
