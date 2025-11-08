import LogoNombre from "../assets/logo-2.png";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[url('/images/grid-bg.png')] bg-cover bg-center flex flex-col items-center py-10 px-4">

      <div className="mb-10">
        <img
          src={LogoNombre}
          alt="Cute Rescue logo"
          className="w-[500px] mx-auto"
        />
      </div>
      
    </div>
  );
}
