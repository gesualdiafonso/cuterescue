import React, { useState } from "react";
import ModalDocumentacion from "../components/ModalDocumentacion";

export default function Documentacion() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState(""); 
  const [editData, setEditData] = useState(null); // datos a editar o ver

  const [vacunas, setVacunas] = useState([]);
  const [pipetas, setPipetas] = useState([]);
  const [desparasitaciones, setDesparasitaciones] = useState([]);

  const handleAddOrUpdate = (data) => {
    if (tipoModal === "vacuna") {
      if (editData) {
        setVacunas(
          vacunas.map((v) => (v.id === editData.id ? { ...data, id: v.id } : v))
        );
      } else {
        setVacunas([...vacunas, { ...data, id: Date.now() }]);
      }
    }
    if (tipoModal === "pipeta") {
      if (editData) {
        setPipetas(
          pipetas.map((p) => (p.id === editData.id ? { ...data, id: p.id } : p))
        );
      } else {
        setPipetas([...pipetas, { ...data, id: Date.now() }]);
      }
    }
    if (tipoModal === "desparasitacion") {
      if (editData) {
        setDesparasitaciones(
          desparasitaciones.map((d) =>
            d.id === editData.id ? { ...data, id: d.id } : d
          )
        );
      } else {
        setDesparasitaciones([...desparasitaciones, { ...data, id: Date.now() }]);
      }
    }

    setEditData(null);
  };

  const handleDelete = (tipo, id) => {
    if (tipo === "vacuna") setVacunas(vacunas.filter((v) => v.id !== id));
    if (tipo === "pipeta") setPipetas(pipetas.filter((p) => p.id !== id));
    if (tipo === "desparasitacion")
      setDesparasitaciones(desparasitaciones.filter((d) => d.id !== id));
  };

  const renderAlerta = (alerta) => (
    <span
      className={alerta === "Activo" ? "alert-active" : "alert-inactive"}
    >
      {alerta}
    </span>
  );

  const openModal = (tipo, data = null) => {
    setTipoModal(tipo);
    setEditData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="documentacion-container">
      {/* ================= VACUNAS ================= */}
      <section className="section-container">
        <h2 className="section-title">Vacunas</h2>
        <div className="cards-container">
          {vacunas.map((v) => (
            <div key={v.id} className="card">
              <div>
                <div className="card-header">
                  <p className="label">Vacuna:</p>
                  <p className="label">Alerta:</p>
                </div>
                <div className="card-status">
                  <p className="text-sm">{v.tipoVacuna}</p>
                  {renderAlerta(v.alerta)}
                </div>
                <p className="label mt-2">Pet:</p>
                <p className="text-xs mt-1">{v.pet}</p>
                <p className="label mt-2">Fecha de aplicación:</p>
                <p className="text-xs mt-1">{v.fechaAplicacion}</p>
                <p className="label mt-3">Fecha de vencimiento:</p>
                <p className="text-xs mt-1">{v.fechaVencimiento}</p>
              </div>
              <button className="btn-card" onClick={() => openModal("vacuna", v)}>
                Ver información
              </button>
            </div>
          ))}

          <div className="card-add" onClick={() => openModal("vacuna")}>
            <div className="plus-sign">+</div>
            <p className="add-text">Agregar vacuna</p>
          </div>
        </div>
      </section>

      {/* ================= PIPETA ================= */}
      <section className="section-container">
        <h2 className="section-title">Pipeta</h2>
        <div className="cards-container">
          {pipetas.map((p) => (
            <div key={p.id} className="card">
              <div className="card-header">
                <p className="label">Producto:</p>
                <p className="label">Alerta:</p>
              </div>
              <div className="card-status">
                <p className="text-sm">{p.producto}</p>
                {renderAlerta(p.alerta)}
              </div>
              <p className="label mt-2">Presentación:</p>
              <p className="text-xs mt-1">{p.presentacion}</p>
              <p className="label mt-2">Fecha de aplicación:</p>
              <p className="text-xs mt-1">{p.fechaAplicacion}</p>
              <p className="label mt-3">Fecha de vencimiento:</p>
              <p className="text-xs mt-1">{p.fechaVencimiento}</p>

              <button className="btn-card" onClick={() => openModal("pipeta", p)}>
                Ver información
              </button>
            </div>
          ))}

          <div className="card-add" onClick={() => openModal("pipeta")}>
            <div className="plus-sign">+</div>
            <p className="add-text">Agregar pipeta</p>
          </div>
        </div>
      </section>

      {/* ================= DESPARASITACIÓN ================= */}
      <section className="section-container">
        <h2 className="section-title">Desparasitación</h2>
        <div className="cards-container">
          {desparasitaciones.map((d) => (
            <div key={d.id} className="card">
              <div className="card-header">
                <p className="label">Antiparasitario:</p>
                <p className="label">Alerta:</p>
              </div>
              <div className="card-status">
                <p className="text-sm">{d.antiparasitario}</p>
                {renderAlerta(d.alerta)}
              </div>
              <p className="label mt-2">Presentación:</p>
              <p className="text-xs mt-1">{d.presentacion}</p>
              <p className="label mt-2">Fecha de aplicación:</p>
              <p className="text-xs mt-1">{d.fechaAplicacion}</p>
              <p className="label mt-3">Fecha de vencimiento:</p>
              <p className="text-xs mt-1">{d.fechaVencimiento}</p>

              <button
                className="btn-card"
                onClick={() => openModal("desparasitacion", d)}
              >
                Ver información
              </button>
            </div>
          ))}

          <div className="card-add" onClick={() => openModal("desparasitacion")}>
            <div className="plus-sign">+</div>
            <p className="add-text">Agregar desparasitación</p>
          </div>
        </div>
      </section>

      {/* MODAL REUTILIZADO */}
      <ModalDocumentacion
        isOpen={isModalOpen}
        tipo={tipoModal}
        data={editData}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onAddOrUpdate={handleAddOrUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
