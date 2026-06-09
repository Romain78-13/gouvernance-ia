import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer from "../ui/Toast";
import { useApp } from "../../context/AppContext";

export default function Layout() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 px-10 py-8 max-w-[1280px] w-full mx-auto animate-fadeup">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
