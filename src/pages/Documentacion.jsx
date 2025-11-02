import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import ModalDocumentacion from "../components/ModalDocumentacion";

export default function Documentacion() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [editData, setEditData] = useState(null);

  const [vacunas, setVacunas] = useState([]);
  const [pipetas, setPipetas] = useState([]);
  const [desparasitaciones, setDesparasitaciones] = useState([]);

  // ===========================
  //  Verificar sesión
  // ===========================
  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate("/ingresar");
        return;
      }
      setUser(data.session.user);
      await fetchDocumentacion(data.session.user.id);
      setCheckingUser(false);
    }
    checkSession();
  }, [navigate]);

  // ===========================
  // Traer datos del usuario
  // ===========================
  async function fetchDocumentacion(userId) {
    const { data, error } = await supabase
      .from("documentacion")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVacunas(data.filter((d) => d.tipo === "vacuna"));
      setPipetas(data.filter((d) => d.tipo === "pipeta"));
      setDesparasitaciones(data.filter((d) => d.tipo === "desparasitacion"));
    }
  }

  // ===========================
  //  Guardar / Actualizar
  // ===========================
  const handleAddOrUpdate = async (data) => {
    if (!user) return;

    const registro = {
      user_id: user.id,
      tipo: tipoModal,
      pet: data.pet || null,
      presentacion: data.presentacion || null,
      fecha_aplicacion: data.fecha_aplicacion || null,
      fecha_vencimiento: data.fecha_vencimiento || null,
      alerta: data.alerta || "Activo",
      tipo_vacuna: data.tipo_vacuna || null,
      producto: data.producto || null,
      antiparasitario: data.antiparasitario || null,
      foto_url: data.foto_url || null,
    };

    if (editData) {
      const { error } = await supabase
        .from("documentacion")
        .update(registro)
        .eq("id", editData.id);

      if (!error) {
        await fetchDocumentacion(user.id);
        setEditData(null);
      }
    } else {
      const { error } = await supabase.from("documentacion").insert([registro]);
      if (!error) await fetchDocumentacion(user.id);
    }
  };

  // ===========================
  // Eliminar registro
  // ===========================
  const handleDelete = async (tipo, id) => {
    await supabase.from("documentacion").delete().eq("id", id);
    if (user) fetchDocumentacion(user.id);
  };

  // ===========================
  // Utilidades UI
  // ===========================
const renderAlerta = (alerta) => (
  <span
    className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
      alerta === "Activo" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {alerta}
  </span>
);


  const openModal = (tipo, data = null) => {
    if (!user) {
      navigate("/ingresar");
      return;
    }
    setTipoModal(tipo);
    setEditData(data);
    setIsModalOpen(true);
  };

  // ===========================
  // Render
  // ===========================
  if (checkingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="documentacion-container">
      {/* VACUNAS */}
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
                  <p className="text-sm">{v.tipo_vacuna}</p>
                  {renderAlerta(v.alerta)}
                </div>
                <p className="label mt-2">Pet:</p>
                <p className="text-xs mt-1">{v.pet}</p>
                <p className="label mt-2">Fecha de aplicación:</p>
                <p className="text-xs mt-1">{v.fecha_aplicacion}</p>
                <p className="label mt-3">Fecha de vencimiento:</p>
                <p className="text-xs mt-1">{v.fecha_vencimiento}</p>
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

      {/* PIPETAS */}
      <section className="section-container">
        <h2 className="section-title">Pipetas</h2>
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
              <p className="text-xs mt-1">{p.fecha_aplicacion}</p>
              <p className="label mt-3">Fecha de vencimiento:</p>
              <p className="text-xs mt-1">{p.fecha_vencimiento}</p>

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

      {/* DESPARASITACIONES */}
      <section className="section-container">
        <h2 className="section-title">Desparasitaciones</h2>
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
              <p className="text-xs mt-1">{d.fecha_aplicacion}</p>
              <p className="label mt-3">Fecha de vencimiento:</p>
              <p className="text-xs mt-1">{d.fecha_vencimiento}</p>

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

      {/* MODAL */}
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
