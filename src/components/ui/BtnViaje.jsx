
export default function BtnViaje({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#22687b] rounded-xl py-2 px-8 text-white font-bold  hover:bg-transparent hover:border  hover:border-[#22687b]  hover:text-black transition-all duration-300"
    >
      Estoy de viaje
    </button>
  );
}
