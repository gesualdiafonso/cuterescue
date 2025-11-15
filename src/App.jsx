import './fonts.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Veterinarias from './pages/Veterinarias';
import Footer from './components/Footer';
import  Documentacion  from './pages/Documentacion';
import UserProfile from './pages/UserProfile'
import ModalDocumentacion from './components/ModalDocumentacion';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Eventos from './pages/Eventos';
import Informe from './pages/Informe';
import InformePet from './pages/InformePet';
<<<<<<< HEAD
=======
import Maps from './pages/Maps';
import AgregarMascota from './pages/AgregarMascota';
import Planes from './pages/Planes';

>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)
import ModalAlert from './components/modals/ModalAlert';
import { useSavedData } from './context/SavedDataContext';
import Maps from './pages/Maps';
import AgregarMascota from './pages/AgregarMascota';

function App() {
<<<<<<< HEAD

  const { showAlert, closeAlert, setAlert } = useSavedData() 
=======
  const { showAlert, alert, closeAlert, alertOn } = useSavedData();
  const location = useLocation();

  //  modal global en todas las rutas excepto /maps
  const showModalOnRoute = location.pathname !== "/maps";
>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)

  return (
    <>

<<<<<<< HEAD
    <Navbar />
        <ModalAlert show={showAlert} alert={setAlert} onClose={closeAlert} />
         <Routes>
       <Route path="/" element={<Dashboard />} />
          
         <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
=======
      {/*  Modal de activación (cuando el usuario presiona Emergency) */}
      <ModalAlert 
        show={showAlert}
        alert={alert}
        onClose={closeAlert}
      />

      {/* Modal global: "Tu mascota está actualmente en modo emergencia" */}
      {alertOn && showModalOnRoute && (
        <ModalAlert
          show={true}
          alert={{
            color: "#F7612A",
            title: "Tu mascota está actualmente en modo emergencia",
            message: "Podrás ver sus movimientos en tiempo real.",
            button: "Ir al mapa",
            redirect: "/maps"
          }}
          onClose={() => {}}
        />
      )}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/detalles' element={<UserProfile />}/>
        <Route path="/maps" element={<Maps />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/informe" element={<InformePet />} />
        <Route path="/agregarmascota" element={<AgregarMascota />} />
      </Routes>  
      <Footer/>
      
    </>
  )
}

export default App
