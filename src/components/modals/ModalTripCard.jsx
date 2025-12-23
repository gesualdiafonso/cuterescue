export default function ModalViajeCard({ onClose }) {
  return (
    <div className=" flex items-center justify-center fixed inset-0 bg-black/70  z-[2000]">

      <div className="bg-[#22687B] rounded-2xl p-6 max-w-md text-center text-white shadow-lg ">
        <h2 className="text-2xl font-bold mb-4">Has activado el botón de viaje</h2>
        <p className="text-white mb-4">
          El modo de viaje fue activado correctamente. La ubicación en tiempo real
          de tu pet está ahora sincronizada y enviando actualizaciones cada 20 minutos.
        </p>
        <p className="text-[#F5DCB3] font-bold mb-4">
          Recibirás notificaciones por correo o en la app con los puntos del recorrido
          y alertas de cualquier desviación detectada.
        </p>
        <p className="text-white  mb-6">
          Mantén tu conexión activa y verifica las notificaciones para seguir el trayecto con seguridad.
        </p>
        <button
          onClick={onClose}
          className="bg-[#F7A82A] text-white px-4 py-2 rounded-lg hover:bg-[#e6931f] transition"
        >
          Seguir mirando
        </button>
      </div>
    </div>
  );
}
