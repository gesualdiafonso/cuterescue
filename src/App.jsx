import "./fonts.css";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Veterinarias from "./pages/Veterinarias";
import Footer from "./components/Footer";
import Documentacion from "./pages/Documentacion";
import UserProfile from "./pages/UserProfile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import InformePet from "./pages/InformePet";
import Maps from "./pages/Maps";
import Planes from "./pages/Planes";
import ModalAlert from "./components/modals/ModalAlert";
import { useSavedData } from "./context/SavedDataContext";
import { useEffect } from "react";
import logo from "./assets/logo.png";
import PrivateRoute from "./router/PrivateRoute";

function App() {
  const { showAlert, alert, closeAlert, alertOn } = useSavedData();
  const location = useLocation();

  // modal global excepto en /maps
  const showModalOnRoute = location.pathname !== "/maps";

  // logo o favicon
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = logo;
  }, []);

  return (
    <>
      <Navbar />

      {/* modal de emergencia */}
      <ModalAlert show={showAlert} alert={alert} onClose={closeAlert} />

      {/* modal global si hay alerta ON */}
      {alertOn && showModalOnRoute && (
        <ModalAlert
          show={true}
          alert={{
            color: "#F7612A",
            title: "Tu mascota está actualmente en modo emergencia",
            message: "Podrás ver sus movimientos en tiempo real.",
            button: "Ir al mapa",
            redirect: "/maps",
          }}
          onClose={() => {}}
        />
      )}

      <Routes>
        {/* ------------- RUTAS PÚBLICAS ------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/eventos" element={<Eventos />} />
        
        {/* ------------- RUTAS PROTEGIDAS ------------- */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/veterinarias-24-hrs"
          element={
            <PrivateRoute>
              <Veterinarias />
            </PrivateRoute>
          }
        />

        <Route
          path="/documentacion"
          element={
            <PrivateRoute>
              <Documentacion />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/detalles"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/maps"
          element={
            <PrivateRoute>
              <Maps />
            </PrivateRoute>
          }
        />

        <Route
          path="/informe"
          element={
            <PrivateRoute>
              <InformePet />
            </PrivateRoute>
          }
        />


        <Route
          path="/planes"
          element={
            <PrivateRoute>
              <Planes />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;