import { MdOutlineModeEdit } from "react-icons/md";
import authProfileBg from "../../assets/auth-profile-bg.png";
import authProfileImg from "../../assets/auth-profile-default.png";
import { useSelector } from "react-redux";

export default function AuthProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log(user);
  return (
    <section className="bg-primary min-h-screen pb-10">
      <div className="h-72 md:h-80 w-full bg-black">
        <img
          src={authProfileBg}
          alt="Auth Profile"
          className="w-full h-full object-center object-cover "
        />
      </div>
      <div className="container mx-auto pb-10 p-2">
        <div className="flex relative justify-end py-3 items-center w-full">
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full -z- bg-violet-400 absolute left-0 transform -translate-y-1/2">
            <img
              src={authProfileImg}
              alt="Auth Profile Image"
              className="w-full h-full object-center object-cover "
            />
          </div>
          <div className="w-16 h-16 rounded-full bg-black flex justify-center items-center p-4">
            <MdOutlineModeEdit className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className=" rounded-2xl py-10 bg-white">
          <ul className="text-xl md:text-4xl text-black">
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-t-2 border-black py-4">
              Name:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Designation:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Phone:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Email:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Address:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Country:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Company Name:
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Total Donation:
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
