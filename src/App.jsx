import './fonts.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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
import Informe from './pages/Informe';

function App() {

  return (
    <>

    <Navbar />
    
         <Routes>
       <Route path="/" element={<Home />} />

         <Route path="/veterinarias-24-hrs" element={<Veterinarias />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/informe" element={<Informe />} />
      </Routes>  
      <Footer/>
      
    </>
  )
}

export default App
