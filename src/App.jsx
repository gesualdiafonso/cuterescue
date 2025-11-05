import './fonts.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormDelTitular from './pages/FormTitular';
import FormDeMascota from './pages/FormMascota';
import FormRegistroConfirmacion from './pages/Confirmacion';
import FormLogin from './pages/FormLogin';
import Veterinarias from './pages/Veterinarias';
import Footer from './components/Footer';
import  Documentacion  from './pages/Documentacion';
import ModalDocumentacion from './components/ModalDocumentacion';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Eventos from './pages/Eventos';

function App() {

  return (
    <>

    <Navbar />
    
         <Routes>
       <Route path="/" element={<Home />} />
        <Route path="/formulario-titular" element={<FormDelTitular />} />
        <Route path="/formulario-mascota" element={<FormDeMascota />} />
         <Route path="/formulario-registro-confirmacion" element={<FormRegistroConfirmacion />} />
         <Route path="/formulario-de-ingreso" element={<FormLogin />} />
         <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
       
      </Routes>  
      <Footer/>
    </>
  )
}

export default App
