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
import Informe from "./pages/Informe";
import InformePet from "./pages/InformePet";
import Maps from "./pages/Maps";
import AgregarMascota from "./pages/AgregarMascota";
import Planes from "./pages/Planes";
import ModalAlert from "./components/modals/ModalAlert";
import { useSavedData } from "./context/SavedDataContext";
import { useEffect } from "react";
import logo from "./assets/logo.png";

function App() {
  const { showAlert, alert, closeAlert, alertOn } = useSavedData();
  const location = useLocation();

  //  modal global en todas las rutas excepto /maps
  const showModalOnRoute = location.pathname !== "/maps";

  // logo o favicon
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = logo;
  }, []);
  return (
    <>
      <Navbar />

      {/*  Modal de activación (cuando el usuario presiona Emergency) */}
      <ModalAlert show={showAlert} alert={alert} onClose={closeAlert} />

      {/* Modal global: "Tu mascota está actualmente en modo emergencia" */}
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detalles" element={<UserProfile />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/informe" element={<InformePet />} />
        <Route path="/agregarmascota" element={<AgregarMascota />} />
        <Route path="/planes" element={<Planes />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
