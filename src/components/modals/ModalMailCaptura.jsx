import AppH1 from "../ui/AppH1";

export default function ModalMailCaptura({ onClose }) {
  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#22687B] rounded-2xl p-6 max-w-md text-center text-white shadow-lg ">
        <AppH1>Captura enviada</AppH1>
        <p className="text-white mb-4">
          Te enviamos un mail con la ubicación exacta desde Google Maps.
        </p>
        
        <button
          onClick={onClose}
          className="btnNaranja px-8"
        >
          Ok
        </button>
      </div>
    </div>
  );
}