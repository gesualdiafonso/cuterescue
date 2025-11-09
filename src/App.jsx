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
import ModalAlert from './components/modals/ModalAlert';
import { useSavedData } from './context/SavedDataContext';
import Maps from './pages/Maps';

function App() {

  const { showAlert, closeAlert } = useSavedData() 

  return (
    <>

    <Navbar />
        <ModalAlert show={showAlert} alert={alert} onClose={closeAlert} />
         <Routes>
       <Route path="/" element={<Dashboard />} />
          
         <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/detalles' element={<UserProfile />}/>
        <Route path="/maps" element={<Maps />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/informe" element={<InformePet />} />
      </Routes>  
      <Footer/>
      
    </>
  )
}

export default App
