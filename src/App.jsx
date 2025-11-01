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
             <Route path="/registro" element={<Register />} />
       
      </Routes>  
      <Footer/>
    </>
  )
}

export default App
