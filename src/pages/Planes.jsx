// src/components/Planes.jsx
import React from "react";

const plans = [
  {
    title: "Plan Freemium",
    price: "$0 / mes",
    features: [
      "Perfil digital",
      "1 mascota para registrar",
      "Anuncios publicitarios",
      "Rastreo de 2 Km",
      "3 slots en documentación",
    ],
    buttonText: "Elegir Plan Gratuito",
    color: "bg-[#3D8E88]",
    textColor: "text-[#3D8E88]",
    borderColor: "border-[#3D8E88]",
  },
  {
    title: "Plan Premium",
    price: "$14.99 / mes",
    features: [
      "Todo lo del plan freemium",
      "Hasta 2 mascotas",
      "Sin publicidad",
      "Rastreo de 8 Km",
      "8 slots en documentación",
    ],
    buttonText: "Elegir Plan Premium",
    color: "bg-[#F7A82A]",
    textColor: "text-[#3D8E88]",
    borderColor: "border-[#F7A82A]",
    highlight: true,
  },
  {
    title: "Plan Plus",
    price: "$39.99 / mes",
    features: [
      "Todo lo del plan Premium",
      "Hasta 5 mascotas",
      "COMPLETAR ---",
      "Rastreo de hasta 20 Km",
      "Documentación infinita",
    ],
    buttonText: "Elegir Plan Plus",
    color: "bg-[#3D8E88]",
    textColor: "text-[#3D8E88]",
    borderColor: "border-[#3D8E88]",
  },
];

const Planes = () => {
  return (
    <section className="py-16 px-4 md:px-12 text-center">
      <h2 className="text-3xl font-bold mb-12">Planes y Precios</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`flex-1 max-w-sm md:max-w-xs border rounded-xl p-8 shadow-lg transition-transform hover:scale-105 ${
              plan.highlight ? "border-2" : "border"
            } ${plan.borderColor} bg-white`}
          >
            {plan.highlight && (
              <div className="text-[#F7A82A] mb-2 text-xl">★</div>
            )}
            <h3 className={`text-xl font-semibold mb-2 ${plan.textColor}`}>
              {plan.title}
            </h3>
            <p className="text-3xl font-bold mb-6">{plan.price}</p>
            <ul className="text-left mb-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#3D8E88] font-bold">✔</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-md text-white font-semibold transition-colors hover:brightness-90 ${
                plan.highlight ? "bg-[#F7A82A] text-white" : "bg-[#3D8E88]"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Planes;