import React, { useState, useEffect } from "react";

export default function ModalDocumentacion({
  isOpen,
  tipo,
  data,
  onClose,
  onAddOrUpdate,
  onDelete,
}) {
  const [formData, setFormData] = useState({ alerta: "Activo" });

  useEffect(() => {
    if (data) {
      setFormData({
        alerta: data.alerta || "Activo",
        pet: data.pet || "",
        tipo_vacuna: data.tipo_vacuna || "",
        producto: data.producto || "",
        antiparasitario: data.antiparasitario || "",
        presentacion: data.presentacion || "",
        fecha_aplicacion: data.fecha_aplicacion
          ? data.fecha_aplicacion.split("T")[0]
          : "",
        fecha_vencimiento: data.fecha_vencimiento
          ? data.fecha_vencimiento.split("T")[0]
          : "",
        foto_url: data.foto_url || "",
      });
    } else {
      setFormData({ alerta: "Activo" });
    }
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0].name : value,
    });
  };

  const handleSubmit = () => {
    if (tipo === "vacuna" && (!formData.tipo_vacuna || !formData.pet)) {
      alert("Debes ingresar el tipo de vacuna y el nombre de la mascota");
      return;
    }
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
                <label>Tipo de vacunación</label>
                <select
                  name="tipo_vacuna"
                  value={formData.tipo_vacuna || ""}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Seleccionar</option>
                  <option>Triple Felina</option>
                  <option>Leucemia Felina (FeLV)</option>
                  <option>Antirrábica</option>
                  <option>Bordetella (Tos de las perreras)</option>
                  <option>Vacuna Séxtuple</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mascota</label>
                <input
                  type="text"
                  name="pet"
                  value={formData.pet || ""}
                  placeholder="Simba"
                  onChange={handleChange}
                  className="input-field"
                />
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
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group w-full">
                <label>Subir foto de libreta sanitaria</label>
                <input
                  type="file"
                  name="foto_url"
                  onChange={handleChange}
                  className="input-field"
                />
                {formData.foto_url && (
                  <p className="file-name mt-1">Archivo: {formData.foto_url}</p>
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
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Presentación</label>
                <select
                  name="presentacion"
                  value={formData.presentacion || ""}
                  onChange={handleChange}
                  className="input-field"
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
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento || ""}
                  onChange={handleChange}
                  className="input-field"
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
        <h2 className="modal-title">
          {data
            ? `Detalles de ${tipo}`
            : `Agregar ${tipo === "vacuna" ? "vacuna" : tipo}`}
        </h2>

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

          <div className="form-actions mt-4">
            <button type="button" className="btn-modal" onClick={onClose}>
              Volver
            </button>

            {!data && (
              <button type="button" className="btn-modal" onClick={handleSubmit}>
                Aceptar
              </button>
            )}

            {data && (
              <>
                <button type="button" className="btn-modal" onClick={handleSubmit}>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-modal delete"
                  onClick={handleDelete}
                >
                  Borrar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
