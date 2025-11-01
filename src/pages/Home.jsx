import React from "react";
import LogoNombre from "../assets/logo-2.png";
import Banner1 from "../assets/banner-1.png";
import Gato from "../assets/gatoArnes.png";
import Perro from "../assets/perroArnes.png";
import QR from "../assets/cardQR.png";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[url('/images/grid-bg.png')] bg-cover bg-center flex flex-col items-center py-10 px-4">
      {/* LOGO */}
      <div className="mb-10">
        <img
          src={LogoNombre}
          alt="Cute Rescue logo"
          className="w-[300px] mx-auto"
        />
      </div>

      {/* Sección superior: gato - QR - perro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full items-center">
        {/* Imagen gato */}
        <div className="flex justify-center">
          <img
            src={Gato}
            alt="Gato con arnés"
            className="rounded-lg object-cover w-full max-w-[350px] h-[300px]"
          />
        </div>

        {/* QR centrado */}
        <div className="flex justify-center">
          <img
            src={QR}
            alt="Código QR"
            className="w-full max-w-[280px] rounded-xl shadow-md"
          />
        </div>

        {/* Imagen perro */}
        <div className="flex justify-center">
          <img
            src={Perro}
            alt="Perro feliz"
            className="rounded-lg object-cover w-full max-w-[350px] h-[300px]"
          />
        </div>
      </div>

      {/* Sección inferior */}
      <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-6xl w-full items-center">
        {/* Imagen grande izquierda */}
        <div className="flex justify-center">
          <img
            src={Banner1}
            alt="Perro con pelota"
            className="rounded-2xl object-cover w-full max-w-[500px] h-[380px]"
          />
        </div>

        {/* Texto inferior derecha */}
        <div className="flex flex-col justify-center text-left px-2">
          <p className="font-semibold text-lg text-gray-900 mb-3 leading-relaxed">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old.
          </p>
          <p className="text-sm text-gray-600">
            The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
            from a line in section 1.10.32.
          </p>
        </div>
      </div>
    </div>
  );
}
