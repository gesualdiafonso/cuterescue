import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ModalDocumentacion from "../components/ModalDocumentation";
import AppH1 from "../components/ui/AppH1";
import { useAuth } from "../context/AuthContext";

/**
 * pag principal para gestionar la documentación veterinaria de cada mascota
permite:
seleccionar una mascota para ver su ficha de datos vets
cargar, editar o eliminar docveterinaria: vacunas, pipetas y antiparasitrios
mostrar alertas según fecha de vencimiento
generar automáticamente notif en supabase para recordar vencimientos y no repetir las notificaciones cada vez que el usuario hace f5
modal dinámico para agregar o editar documentación
 */

export default function Documentation() {
  const { user, loading } = useAuth(); 
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [vacunas, setVacunas] = useState([]);
  const [pipetas, setPipetas] = useState([]);
  const [desparasitaciones, setDesparasitaciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchMascotas() {
      const { data, error } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      if (error) {
        console.error("Error cargando mascotas:", error);
        return;
      }

      setMascotas(data || []);
      setSelectedMascota(null);
    }

    fetchMascotas();
  }, [user]);

// genera notificaciones cuando algo esta por vencer
  const generateNotifications = async (items, mascota, userId) => {
    if (!userId || !mascota) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const item of items) {
      if (!item.fecha_vencimiento) continue;

      const fechaVenc = new Date(item.fecha_vencimiento);
      fechaVenc.setHours(0, 0, 0, 0);

      const diffDays = (fechaVenc - today) / (1000 * 60 * 60 * 24);

      const diasPrevios = [7, 1, 0];
      if (!diasPrevios.includes(diffDays)) continue;

      const tratamiento =
        item.tipo === "vacuna"
          ? item.tipo_vacuna
          : item.tipo === "pipeta"
          ? item.producto
          : item.antiparasitario;

      const nombreMascota = mascota.nombre || "tu mascota";

      const mensaje =
        diffDays === 0
          ? `¡Hoy vence ${tratamiento} de ${nombreMascota}!`
          : `Falta ${diffDays} día para que venza ${tratamiento} de ${nombreMascota}`;

      const { data: existing, error } = await supabase
        .from("notificaciones")
        .select("*")
        .eq("documentacion_id", item.id)
        .eq("user_id", userId)
        .eq("mensaje", mensaje);

      if (error) {
        console.error("Error buscando notificaciones:", error);
        continue;
      }

      if (!existing || existing.length === 0) {
        await supabase.from("notificaciones").insert([
          {
            user_id: userId,
            documentacion_id: item.id,
            mensaje,
            fecha_alerta: today,
            vista: false,
          },
        ]);
      }
    }
  };

  /**
   * obtenemos toda la doc relacionada a una mascota:
   * vacunas, pipetas y desparasitaciones y genera notificaciones en función de fechas de vencimiento
   */
  const fetchDocumentation = async (mascota) => {
    if (!user || !mascota?.id) return;

    const { data, error } = await supabase
      .from("documentacion")
      .select("*")
      .eq("user_id", user.id)
      .eq("mascota_id", mascota.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando documentación:", error);
      return;
    }

    const vacunasData = data.filter((d) => d.tipo === "vacuna");
    const pipetasData = data.filter((d) => d.tipo === "pipeta");
    const desparasitacionesData = data.filter(
      (d) => d.tipo === "desparasitacion"
    );

    setVacunas(vacunasData);
    setPipetas(pipetasData);
    setDesparasitaciones(desparasitacionesData);

    await generateNotifications(
      [...vacunasData, ...pipetasData, ...desparasitacionesData],
      mascota,
      user.id
    );
  };

  /**
   * Maneja el cambio de la mascota seleccionada en el desplegable
   */
  const handleSelectPet = async (e) => {
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
    await fetchDocumentation(mascota);
  };

  /**
   * Abre el modal de documentación para agregar o editar un registro
   */
  const openModal = (tipo, data = null) => {
    if (!selectedMascota) {
      alert("Selecciona una mascota primero");
      return;
    }
    setTipoModal(tipo);
    setEditData(data);
    setIsModalOpen(true);
  };

  // inserta o actualiza un registro de doc veterinaria
  const handleAddOrUpdate = async (data) => {
    if (!selectedMascota || !user) return;

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
      await supabase
        .from("documentacion")
        .update(registro)
        .eq("id", editData.id);
    }

    await fetchDocumentation(selectedMascota);
    setIsModalOpen(false);
    setEditData(null);
  };

  // elimina un registro de doc vet segun su id
  const handleDelete = async (_tipo, id) => {
    await supabase.from("documentacion").delete().eq("id", id);
    await fetchDocumentation(selectedMascota);
  };

  // renderiza indicador visual del estado de alerta
  const renderAlerta = (alerta) => (
    <span
      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
        alerta === "Activo" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {alerta}
    </span>
  );

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="documentacion-container px-4 md:px-16 lg:px-32 py-8">
      <div className="mb-8 text-center">
        <AppH1 className="estilosH1">Ficha médica de tus mascotas</AppH1>
        <p className="text-gray-600 max-w-4xl mx-auto">
          Mantén toda la información de salud de tus mascotas organizada y
          accesible.
        </p>

        <div className="mt-4 inline-block relative">
          <select
            value={selectedMascota ? selectedMascota.id.toString() : ""}
            onChange={handleSelectPet}
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
            default:
              break;
          }

          return (
            <section key={categoria} className="section-container mb-10">
              <h2 className="section-title text-xl font-semibold mb-4">
                {titulo}
              </h2>

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
                      <p className="text-xs mt-1">
                        {item.fecha_aplicacion || "-"}
                      </p>
                      <p className="label mt-2">Fecha de vencimiento:</p>
                      <p className="text-xs mt-1">
                        {item.fecha_vencimiento || "-"}
                      </p>
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
