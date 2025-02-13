import { MdOutlineModeEdit } from "react-icons/md";

export default function AuthProfile() {
  return (
    <section className="bg-primary min-h-screen pb-10">
      <div className="h-72 w-full bg-black"></div>
      <div className="container mx-auto pb-10">
        <div className="flex justify-between items-center w-full">
          <div className="w-48 h-48 rounded-full bg-violet-400 transform -translate-y-32"></div>
          <div className="w-16 h-16 rounded-full bg-black flex justify-center items-center p-4">
            <MdOutlineModeEdit className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className=" rounded-2xl py-10 bg-white">
          <ul className="text-xl md:text-4xl text-black">
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-t-2 border-violet-400 py-4">
              Name:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Designation:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Phone:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Email:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Address:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Country:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Company Name:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-violet-400 py-4">
              Total Donation:
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
