import React, { useState, useEffect } from "react";

export default function ModalDocumentacion({ isOpen, tipo, data, onClose, onAddOrUpdate, onDelete }) {
  const [formData, setFormData] = useState({ alerta: "Activo" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data) {
      setFormData({
        alerta: data.alerta || "Activo",
        tipo_vacuna: data.tipo_vacuna || "",
        producto: data.producto || "",
        antiparasitario: data.antiparasitario || "",
        presentacion: data.presentacion || "",
        fecha_aplicacion: data.fecha_aplicacion ? data.fecha_aplicacion.split("T")[0] : "",
        fecha_vencimiento: data.fecha_vencimiento ? data.fecha_vencimiento.split("T")[0] : "",
        foto_url: data.foto_url || "",
      });
    } else {
      setFormData({ alerta: "Activo" });
    }
    setErrors({});
    setErrorMessage("");
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? URL.createObjectURL(files[0]) : value,
    });
    setErrors({ ...errors, [name]: false });
    setErrorMessage("");
  };

  const handleSubmit = () => {
    let newErrors = {};
    let message = "";

    // Validaciones generales
    if (!formData.fecha_aplicacion) newErrors.fecha_aplicacion = true;
    if (!formData.fecha_vencimiento) newErrors.fecha_vencimiento = true;

    // Validación por tipo
    if (tipo === "vacuna" && !formData.tipo_vacuna) {
      newErrors.tipo_vacuna = true;
    }
    if (tipo === "pipeta" && !formData.producto) {
      newErrors.producto = true;
    }
    if (tipo === "desparasitacion" && (!formData.antiparasitario || !formData.presentacion)) {
      if (!formData.antiparasitario) newErrors.antiparasitario = true;
      if (!formData.presentacion) newErrors.presentacion = true;
    }

    // Si hay algún error, mostrar mensaje y no enviar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Por favor completá todos los campos obligatorios antes de continuar.");
      return;
    }

    // Si todo está correcto
    setErrorMessage("");
    onAddOrUpdate(formData);
    onClose();
  };

  const handleDelete = () => {
    if (data) {
      onDelete(tipo, data.id);
      onClose();
    }
  };

  const renderFields = () => {
    switch (tipo) {
      case "vacuna":
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Vacuna</label>
                <select
                  name="tipo_vacuna"
                  value={formData.tipo_vacuna || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.tipo_vacuna ? "border-red-500" : ""}`}
                >
                  <option value="">Seleccionar</option>
                  <option>Triple Felina</option>
                  <option>Leucemia Felina (FeLV)</option>
                  <option>Antirrábica</option>
                  <option>Bordetella (Tos de las perreras)</option>
                  <option>Vacuna Séxtuple</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Aplicación</label>
                <input
                  type="date"
                  name="fecha_aplicacion"
                  value={formData.fecha_aplicacion || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.fecha_aplicacion ? "border-red-500" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.fecha_vencimiento ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group w-full">
                <label>Subir foto (opcional)</label>
                <input type="file" name="foto_url" onChange={handleChange} className="input-field" />
                {formData.foto_url && (
                  <p className="file-name mt-1 text-sm text-gray-600">
                    Archivo cargado correctamente
                  </p>
                )}
              </div>
            </div>
          </>
        );

      case "pipeta":
      case "desparasitacion":
        const label = tipo === "pipeta" ? "Producto" : "Antiparasitario";
        const fieldName = tipo === "pipeta" ? "producto" : "antiparasitario";
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>{label}</label>
                <input
                  type="text"
                  name={fieldName}
                  value={formData[fieldName] || ""}
                  onChange={handleChange}
                  className={`input-field ${errors[fieldName] ? "border-red-500" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>Presentación</label>
                <select
                  name="presentacion"
                  value={formData.presentacion || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.presentacion ? "border-red-500" : ""}`}
                >
                  <option value="">Seleccionar</option>
                  <option>Pipeta (aceite en la nuca)</option>
                  <option>Comprimido</option>
                  <option>Talco</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Aplicación</label>
                <input
                  type="date"
                  name="fecha_aplicacion"
                  value={formData.fecha_aplicacion || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.fecha_aplicacion ? "border-red-500" : ""}`}
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento || ""}
                  onChange={handleChange}
                  className={`input-field ${errors.fecha_vencimiento ? "border-red-500" : ""}`}
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{data ? `Detalles de ${tipo}` : `Agregar ${tipo}`}</h2>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          {renderFields()}

          <div className="form-row mt-3">
            <label>Alerta:</label>
            <select
              name="alerta"
              value={formData.alerta || "Activo"}
              onChange={handleChange}
              className="input-field"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>

          <div className="form-actions flex flex-col items-center mt-4">
            <div className="flex justify-center gap-3">
              <button type="button" className="btnAzul w-32 " onClick={onClose}>
                Volver
              </button>
              <button type="button" className="btnNaranja w-32" onClick={handleSubmit}>
                {data ? "Editar" : "Agregar"}
              </button>
              {data && (
                <button  type="button" className="btnTransparente delete w-32" onClick={handleDelete}>
                  Borrar
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-600 text-sm mt-3 text-center font-medium">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
