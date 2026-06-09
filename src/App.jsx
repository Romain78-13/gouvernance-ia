import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import { ROLES } from "./utils/constants";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/Tickets/TicketList";
import TicketNew from "./pages/Tickets/TicketNew";
import TicketDetail from "./pages/Tickets/TicketDetail";
import ChampionsPage from "./pages/Champions/ChampionsPage";
import CockpitDashboard from "./pages/Cockpit/CockpitDashboard";
import AdminPage from "./pages/Admin/AdminPage";
import AidePage from "./pages/Aide/AidePage";

// The "/" landing redirects to each role's home view.
function Home() {
  const { currentUser } = useApp();
  if (currentUser?.role === ROLES.COCKPIT) return <Navigate to="/cockpit" replace />;
  if (currentUser?.role === ROLES.EMPLOYE) return <Navigate to="/tickets" replace />;
  return <Dashboard />;
}

// Guards the cockpit dashboard to cockpit + admin.
function CockpitRoute() {
  const { currentUser } = useApp();
  if (currentUser?.role !== ROLES.COCKPIT && currentUser?.role !== ROLES.ADMIN)
    return <Navigate to="/" replace />;
  return <CockpitDashboard />;
}

function AdminRoute() {
  const { currentUser } = useApp();
  if (currentUser?.role !== ROLES.ADMIN) return <Navigate to="/" replace />;
  return <AdminPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cockpit" element={<CockpitRoute />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="tickets/new" element={<TicketNew />} />
        <Route path="tickets/:id" element={<TicketDetail />} />
        <Route path="tickets/:id/edit" element={<TicketNew />} />
        <Route path="champions" element={<ChampionsPage />} />
        <Route path="aide" element={<AidePage />} />
        <Route path="admin" element={<AdminRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
