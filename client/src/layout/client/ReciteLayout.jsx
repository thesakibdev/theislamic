import Header from "@/components/client/Header";
import ReciteSideBar from "@/components/client/ReciteSideBar";
import { Outlet } from "react-router-dom";

export default function ReciteLayout() {
  return (
    <div className="">
      <Header />

      <div className="flex">
        <ReciteSideBar />
        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
