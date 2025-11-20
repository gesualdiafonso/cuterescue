import React, { useEffect, useState } from "react";
import eventosData from "../utils/data/eventosba.json"; 
import AppH1 from "../components/ui/AppH1";

export default function Eventos() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = eventosData.events || eventosData || [];
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-6xl w-full mx-auto py-10">
          <AppH1 className="estilosH1 text-center">
        Eventos mascoteros
      </AppH1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {events.map((ev) => (
            <article key={ev.id} className="p-8 rounded-2xl bg-[#22687B] shadow-sm">
                <h2 className="text-2xl font-bold text-center text-white">{ev.title}</h2>
                <p className="text-sm text-[#d5d5d5]">{ev.summary}</p>

                <div className="mt-2 text-xs text-white">
                    <strong className="text-[#f7a934]">Ubicaciones:</strong>
                    <ul className="list-disc ml-4 mb-5">
                    {ev.locations?.map((loc, i) => (
                        <li key={i}>
                        {loc.name} — {loc.address}
                        </li>
                    ))}
                    </ul>

                    <strong className="text-[#f7a934]">Acceso:</strong>
                    <p className="mb-5">
                    {ev.access?.castracion ??
                        ev.access?.turnos ??
                        ev.access?.vacunacion ??
                        ""}
                    </p>

                    <strong className="text-[#f7a934]">Requisitos rápidos:</strong>
                    <ul className="list-disc ml-4 mb-5">
                    {ev.requirements?.map((r, idx) => (
                        <li key={idx}>{r}</li>
                    ))}
                    </ul>

                </div>
                <a
                    href={ev.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#f7a82a] px-5 py-2 rounded-lg text-white text-xs text-center flex justify-center items-center"
                >
                    Ver más
                </a>
            </article>
        ))}
        </div>
    </div>
  );
}