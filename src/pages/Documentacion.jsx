import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ModalDocumentacion from "../components/ModalDocumentacion";
import AppH1 from "../components/ui/AppH1";

export default function Documentacion() {
  const [user, setUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);

  const [vacunas, setVacunas] = useState([]);
  const [pipetas, setPipetas] = useState([]);
  const [desparasitaciones, setDesparasitaciones] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return;

      setUser(data.session.user);

      const { data: mascotasData } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", data.session.user.id);

      setMascotas(mascotasData || []);
      setSelectedMascota(null);
      setCheckingUser(false);
    }
    init();
  }, []);

  const fetchDocumentacion = async (userId, mascotaId) => {
    if (!user || !mascotaId) return;

    const { data } = await supabase
      .from("documentacion")
      .select("*")
      .eq("user_id", userId)
      .eq("mascota_id", mascotaId)
      .order("created_at", { ascending: false });

    const vacunasData = data.filter((d) => d.tipo === "vacuna");
    const pipetasData = data.filter((d) => d.tipo === "pipeta");
    const desparasitacionesData = data.filter((d) => d.tipo === "desparasitacion");

    setVacunas(vacunasData);
    setPipetas(pipetasData);
    setDesparasitaciones(desparasitacionesData);

    // Crear notificaciones según fecha de vencimiento
    await generarNotificaciones(vacunasData.concat(pipetasData, desparasitacionesData));
  };

  const generarNotificaciones = async (items) => {
    if (!user) return;
    const today = new Date();

    for (const item of items) {
      if (!item.fecha_vencimiento) continue;

      const fechaVenc = new Date(item.fecha_vencimiento);
      const diffTime = fechaVenc - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let diasPrevios = [7, 1]; // Notificaciones 7 días y 1 día antes, 7  dias no funciona arreglar !!!! 
      if (!diasPrevios.includes(diffDays)) continue;

      const mensaje =
        diffDays === 0
          ? `¡Hoy vence ${item.tipo === "vacuna" ? item.tipo_vacuna : item.tipo === "pipeta" ? item.producto : item.antiparasitario} de ${selectedMascota.nombre}!`
          : `Falta ${diffDays} día para que venza ${item.tipo === "vacuna" ? item.tipo_vacuna : item.tipo === "pipeta" ? item.producto : item.antiparasitario} de ${selectedMascota.nombre}`;

      // Evitar duplicados
      const { data: existing } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("documentacion_id", item.id)
        .eq("user_id", user.id)
        .eq("mensaje", mensaje);

      if (!existing || existing.length === 0) {
        await supabase.from("notificaciones").insert([
          {
            user_id: user.id,
            documentacion_id: item.id,
            mensaje,
            fecha_alerta: today,
            vista: false,
          },
        ]);
      }
    }
  };

  const handleSelectMascota = async (e) => {
    const mascotaId = e.target.value;
    if (!mascotaId) {
      setSelectedMascota(null);
      setVacunas([]);
      setPipetas([]);
      setDesparasitaciones([]);
      return;
    }

    const mascota = mascotas.find((m) => m.id.toString() === mascotaId);
    setSelectedMascota(mascota);

    if (user && mascota) {
      await fetchDocumentacion(user.id, mascota.id);
    }
  };

  const openModal = (tipo, data = null) => {
    if (!selectedMascota) {
      alert("Selecciona una mascota primero");
      return;
    }
    setTipoModal(tipo);
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = async (data) => {
    if (!selectedMascota) {
      alert("Selecciona una mascota primero");
      return;
    }

    const registro = {
      user_id: user.id,
      mascota_id: selectedMascota.id,
      tipo: tipoModal,
      fecha_aplicacion: data.fecha_aplicacion || null,
      fecha_vencimiento: data.fecha_vencimiento || null,
      alerta: data.alerta || "Activo",
      tipo_vacuna: data.tipo_vacuna || null,
      producto: data.producto || null,
      antiparasitario: data.antiparasitario || null,
      presentacion: data.presentacion || null,
      foto_url: data.foto_url || null,
    };

    if (!editData) {
      await supabase.from("documentacion").insert([registro]);
    } else {
      await supabase.from("documentacion").update(registro).eq("id", editData.id);
    }

    await fetchDocumentacion(user.id, selectedMascota.id);
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleDelete = async (tipo, id) => {
    await supabase.from("documentacion").delete().eq("id", id);
    if (selectedMascota) await fetchDocumentacion(user.id, selectedMascota.id);
  };

  const renderAlerta = (alerta) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
        alerta === "Activo" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {alerta}
    </span>
  );

  if (checkingUser) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="documentacion-container px-4 md:px-16 lg:px-32 py-8">
      <div className="mb-8 text-center">
          <AppH1 className="estilosH1">
          Ficha médica de tus mascotas
        </AppH1>
        <p className="text-gray-600 max-w-4xl mx-auto">
          Mantén toda la información de salud de tus mascotas organizada y accesible.
        </p>

        <div className="mt-4 inline-block relative">
          <select
            value={selectedMascota ? selectedMascota.id.toString() : ""}
            onChange={handleSelectMascota}
            className="border border-gray-300 rounded-lg py-2 px-4 pr-8 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecciona a tu mascota</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.id.toString()}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMascota ? (
        ["vacuna", "pipeta", "desparasitacion"].map((categoria) => {
          let items = [];
          let titulo = "";
          switch (categoria) {
            case "vacuna":
              items = vacunas;
              titulo = "Vacunas";
              break;
            case "pipeta":
              items = pipetas;
              titulo = "Pipetas";
              break;
            case "desparasitacion":
              items = desparasitaciones;
              titulo = "Desparasitaciones";
              break;
          }

          return (
            <section key={categoria} className="section-container mb-10">
              <h2 className="section-title text-xl font-semibold mb-4">{titulo}</h2>

              
              <div className="cards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card min-h-[360px] w-full max-w-lg flex flex-col justify-between bg-gray-50 shadow-sm rounded-lg p-6"
                  >
                    <div>
                      <div className="card-header flex justify-between">
                        <p className="label font-semibold">
                          {categoria === "vacuna"
                            ? "Vacuna"
                            : categoria === "pipeta"
                            ? "Producto"
                            : "Antiparasitario"}
                          :
                        </p>
                        <p className="label font-semibold">Alerta:</p>
                      </div>
                      <div className="card-status flex justify-between">
                        <p className="text-sm">
                          {categoria === "vacuna"
                            ? item.tipo_vacuna
                            : categoria === "pipeta"
                            ? item.producto
                            : item.antiparasitario}
                        </p>
                        {renderAlerta(item.alerta)}
                      </div>

                      <p className="label mt-2">Fecha de aplicación:</p>
                      <p className="text-xs mt-1">{item.fecha_aplicacion || "-"}</p>
                      <p className="label mt-2">Fecha de vencimiento:</p>
                      <p className="text-xs mt-1">{item.fecha_vencimiento || "-"}</p>
                    </div>

                    <button
                      className="btn-card mt-4 w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
                      onClick={() => openModal(categoria, item)}
                    >
                      Ver información
                    </button>
                  </div>
                ))}

                <div
                  className="card-add min-h-[360px] w-full max-w-lg flex flex-col justify-center items-center bg-gray-50 shadow-sm rounded-lg cursor-pointer p-6"
                  onClick={() => openModal(categoria)}
                >
                  <div className="plus-sign text-4xl font-bold">+</div>
                  <p className="add-text mt-2 font-semibold">
                    {categoria === "vacuna"
                      ? "Agregar vacuna"
                      : categoria === "pipeta"
                      ? "Agregar pipeta"
                      : "Agregar desparasitación"}
                  </p>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-center text-gray-500 mt-6">
          Selecciona una mascota para ver su documentación.
        </p>
      )}

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
