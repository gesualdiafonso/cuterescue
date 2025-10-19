import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProcesoRegistro from '../components/ProcesoRegistro';

export default function FormMascota() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    peso: '',
    enfermedades: '',
    foto: null,
  });

  const [errores, setErrores] = useState([]);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'foto') {
      setFormData((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errores.includes(name) && value.trim() !== '') {
        setErrores((prev) => prev.filter((campo) => campo !== name));
      }
    }
  };

  const handleNext = () => {
    const camposObligatorios = ['nombre', 'especie', 'raza', 'fechaNacimiento', 'peso', 'foto'];

    const camposVacios = camposObligatorios.filter(
      (campo) => {
        if (campo === 'foto') return !formData.foto;
        return !formData[campo].trim();
      }
    );

    if (camposVacios.length > 0) {
      setErrores(camposVacios);
      setMostrarMensaje(true);
      return;
    }

    setMostrarMensaje(false);
    navigate('/confirmacion');
  };

  const inputClass = (name) =>
    `w-full border px-3 py-2 rounded-[20px] focus:outline-none focus:ring-2 ${
      errores.includes(name)
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-[#3D8E88]'
    }`;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
   
        <div className="md:w-1/4">
          <ProcesoRegistro currentStep={2} />
        </div>

        {/* Columna derecha: Formulario */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-semibold mb-6">Datos de la mascota</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre ocupa toda la fila */}
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={inputClass('nombre')}
              />
            </div>

            {/* Especie */}
            <div>
              <label className="block text-gray-700 mb-1">Especie</label>
              <select
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                className={inputClass('especie')}
              >
                <option value="">Seleccionar especie</option>
                <option value="canino">Canino</option>
                <option value="felino">Felino</option>
              </select>
            </div>

            {/* Raza */}
            <div>
              <label className="block text-gray-700 mb-1">Raza</label>
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                placeholder="Raza"
                className={inputClass('raza')}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-gray-700 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={inputClass('fechaNacimiento')}
              />
            </div>

            {/* Peso */}
            <div>
              <label className="block text-gray-700 mb-1">Peso</label>
              <input
                type="text"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                placeholder="Kg"
                className={inputClass('peso')}
              />
            </div>

            {/* Enfermedades (opcional) */}
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Enfermedades</label>
              <input
                type="text"
                name="enfermedades"
                value={formData.enfermedades}
                onChange={handleChange}
                placeholder="Campo no obligatorio"
                className={inputClass('enfermedades')}
              />
            </div>

            {/* Adjuntar foto */}
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Adjuntar una foto</label>
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                className={inputClass('foto')}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-2">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#3D8E88] text-white rounded-[20px] hover:bg-[#32726b]"
            >
              Continuar
            </button>

            {mostrarMensaje && (
              <p className="text-red-500 font-medium mt-2">Complete todos los campos obligatorios</p>
            )}

            <a href="#" className="text-blue-600 hover:underline mt-2">
              Comunicarse con un asesor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
