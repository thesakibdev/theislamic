import { Outlet } from "react-router-dom";
import Banner from "../../assets/auth-banner.jpg";

export default function AuthLayout() {
  return (
    <section
      className="flex justify-center items-center h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      <main>
        <Outlet />
      </main>
    </section>
  );
}
