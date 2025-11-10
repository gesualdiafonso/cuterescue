import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModalAlert({ show, alert, onClose }){
    const navigate = useNavigate();
    if(!show || !alert) return null;

    const { color, title, message, button, redirect } = alert;
    

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
                className="rounded-2xl p-8 text-center max-w-md w-full shadow-xl"
                style={{ backgroundColor: color }}
            >
                <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                <p className="text-white text-lg mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                <button
                    onClick={() => {
                    onClose();
                    navigate(redirect);
                    }}
                    className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                    {button}
                </button>
                </div>
            </div>
        </div>
    );
}