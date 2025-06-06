import { MdOutlineModeEdit } from "react-icons/md";
import authProfileBg from "../../assets/auth-profile-bg.png";
import authProfileImg from "../../assets/auth-profile-default.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "@/slices/authslice";
import { getUserDetails } from "../../slices/authslice";

export default function AuthProfile() {
  const { user, userDetails } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const Id = user?.id;
    dispatch(getUserDetails(Id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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
              src={userDetails?.profileImage || authProfileImg}
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
              Name: {userDetails?.name}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Phone: {userDetails?.phone}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Email: {userDetails?.email}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Profession: {userDetails?.profession}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Designation: {userDetails?.designation}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Company Name: {userDetails?.companyName}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Total Donation: {userDetails?.totalDonation}
            </li>
            <li className="px-5 cursor-pointer md:px-10 border-b-2 border-black py-4">
              Address:{" "}
              {userDetails?.address?.map((address, index) => (
                <div className="" key={index}>
                  <p>{address.street}</p>
                  <p>{address.city}</p>
                  <p>{address.country}</p>
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
