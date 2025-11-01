import React, { useState, useEffect } from "react";

export default function ModalDocumentacion({
  isOpen,
  tipo,
  data,
  onClose,
  onAddOrUpdate,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    alerta: "Activo",
  });

  useEffect(() => {
    if (data) setFormData(data);
    else setFormData({ alerta: "Activo" });
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
    onAddOrUpdate(formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(tipo, data.id);
    onClose();
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
                  name="tipoVacuna"
                  value={formData.tipoVacuna || ""}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Seleccionar</option>
                  <option>Triple Felina</option>
                  <option>Leucemia Felina (FeLV)</option>
                  <option>Antirrábica</option>
                  <option>Bordetella (Tos de las perreras)</option>
                  <option>Vacuna Sextuple</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pet</label>
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
                  name="fechaAplicacion"
                  value={formData.fechaAplicacion || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento || ""}
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
                  name="foto"
                  onChange={handleChange}
                  className="input-field"
                />
                {formData.foto && (
                  <p className="file-name mt-1">Archivo: {formData.foto}</p>
                )}
              </div>
            </div>
          </>
        );

      case "pipeta":
      case "desparasitacion":
        const label = tipo === "pipeta" ? "Producto" : "Antiparasitario";
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>{label}</label>
                <input
                  type="text"
                  name={tipo === "pipeta" ? "producto" : "antiparasitario"}
                  value={
                    tipo === "pipeta"
                      ? formData.producto || ""
                      : formData.antiparasitario || ""
                  }
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
                  name="fechaAplicacion"
                  value={formData.fechaAplicacion || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento || ""}
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

        <form className="modal-form">
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
                <button
                  type="button"
                  className="btn-modal"
                  onClick={handleSubmit}
                >
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
