import './App.css';
import './fonts.css';
import Navbar from './components/Navbar';
import { Routes, Route, Link } from 'react-router-dom';
import FormDelTitular from './pages/Form-titular';
import FormDeMascota from './pages/Form-mascota';
import FormRegistroConfirmacion from './pages/Confirmacion';

function App() {

  return (
    <>
    <Navbar />
         <Routes>
        <Route path="/formulario-titular" element={<FormDelTitular />} />
        <Route path="/formulario-mascota" element={<FormDeMascota />} />
         <Route path="/formulario-registro-confirmacion" element={<FormRegistroConfirmacion />} />
      </Routes>
    </>
  )
}

export default App
