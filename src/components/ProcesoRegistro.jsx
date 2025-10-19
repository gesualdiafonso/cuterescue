
export default function ProcesoRegistro({ currentStep = 1 }) {
  const steps = [
    { id: 1, label: "Datos del titular" },
    { id: 2, label: "Datos de mascota" },
    { id: 3, label: "Confirmación" },
  ];

  return (
    <div className="max-w-xs mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Proceso de registro</h2>
      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                currentStep === step.id ? "bg-[#F6A82B]" : "bg-[#1E687B]"
              }`}
            >
              {step.id}
            </div>
            <span className="text-gray-700">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
