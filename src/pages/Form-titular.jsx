import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProcesoRegistro from '../components/ProcesoRegistro';

// Array de provincias argentinas
const provincias = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
  "Ciudad Autónoma de Buenos Aires"
];


const normalizeValue = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

export default function FormTitular() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    tipoDocumento: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
    provincia: '',
    codigoPostal: '',
  });

  const [errores, setErrores] = useState([]);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores.includes(name) && value.trim() !== '') {
      setErrores((prev) => prev.filter((campo) => campo !== name));
    }
  };

  const handleNext = () => {
    const camposObligatorios = [
      'nombre', 'apellido', 'fechaNacimiento', 'genero',
      'tipoDocumento', 'documento', 'telefono', 'email',
      'direccion', 'provincia', 'codigoPostal'
    ];

    const camposVacios = camposObligatorios.filter(
      (campo) => !formData[campo].trim()
    );

    if (camposVacios.length > 0) {
      setErrores(camposVacios);
      setMostrarMensaje(true);
      return;
    }

    setMostrarMensaje(false);
    navigate('/formulario-mascota');
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
        {/* Columna izquierda: Proceso de registro */}
        <div className="md:w-1/4">
          <ProcesoRegistro currentStep={1} />
        </div>

        {/* Columna derecha: Formulario */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-semibold mb-6">Datos del titular</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
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

            <div>
              <label className="block text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className={inputClass('apellido')}
              />
            </div>

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

            <div>
              <label className="block text-gray-700 mb-1">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={inputClass('genero')}
              >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tipo de documento</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className={inputClass('tipoDocumento')}
              >
                <option value="">Seleccionar tipo de documento</option>
                <option value="dni">DNI</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="ci">Cédula</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Documento</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="Documento"
                className={inputClass('documento')}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Teléfono celular</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Código de área y número. Solo números."
                className={inputClass('telefono')}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass('email')}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className={inputClass('direccion')}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Provincia</label>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className={inputClass('provincia')}
              >
                <option value="">Seleccionar</option>
                {provincias.map((prov) => (
                  <option key={prov} value={normalizeValue(prov)}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                placeholder="Código Postal"
                className={inputClass('codigoPostal')}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-2">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#3D8E88] text-white rounded-[20px] hover:bg-[#32726b]"
            >
              Siguiente
            </button>

            {mostrarMensaje && (
              <p className="text-red-500 font-medium mt-2">Complete todos los campos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
