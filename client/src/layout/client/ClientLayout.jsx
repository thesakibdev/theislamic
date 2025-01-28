import Header from "@/components/client/Header";
import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="">
      <Header />

      <main className="">
        <Outlet />
      </main>
    </div>
  );
}
