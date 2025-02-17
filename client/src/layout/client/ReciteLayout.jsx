import Header from "@/components/client/Header";
import ReciteHeader from "@/components/client/ReciteHeader";
import ReciteSideBar from "@/components/client/ReciteSideBar";
import { Outlet } from "react-router-dom";

export default function ReciteLayout() {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto relative overflow-hidden">
        <ReciteHeader />
        <main className="md:flex ">
          <ReciteSideBar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
