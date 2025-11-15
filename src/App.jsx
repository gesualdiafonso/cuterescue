import './fonts.css';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Veterinarias from './pages/Veterinarias';
import Footer from './components/Footer';
import Documentacion from './pages/Documentacion';
import UserProfile from './pages/UserProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';
import Informe from './pages/Informe';
import InformePet from './pages/InformePet';
import Maps from './pages/Maps';
import AgregarMascota from './pages/AgregarMascota';
import Planes from './pages/Planes';
import ModalAlert from './components/modals/ModalAlert';
import { useSavedData } from './context/SavedDataContext';

function App() {
  const { showAlert, closeAlert, setAlert } = useSavedData();
  const location = useLocation();

  // Mostrar modal en todas las rutas excepto /maps
  const showModalOnRoute = location.pathname !== "/maps";

  return (
    <>
      <Navbar />

      {showModalOnRoute && (
        <ModalAlert show={showAlert} alert={setAlert} onClose={closeAlert} />
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
        <Route path="/informe" element={<Informe />} />
        <Route path="/agregarmascota" element={<AgregarMascota />} />
        <Route path="/planes" element={<Planes />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
