import React, {useEffect, useState} from "react";
import PetCards from "../components/ui/PetsCard";
<<<<<<< HEAD
import MapsViwer from "../components/maps/MapsViwer";
=======
import MapsViewer from "../components/maps/MapsViewer";
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
import Maps from "../components/maps/Maps"
import EditPetForm from "../components/ui/EditPetForm";
import BtnViaje from "../components/ui/BtnViaje"
import BtnEmergency from "../components/ui/BtnEmergency";
import BtnPetMove from "../components/ui/BtnPetMove"
import ModalEditPet from "../components/modals/ModalEditPet";
import { supabase } from "../services/supabase";
import { useSavedData } from "../context/SavedDataContext";


export default function InformePet(){

    const[mascotas, setMascotas] = useState([]);
    const{selectedPet, setSelectedPet}= useSavedData();
    const[location, setLocation] = useState(null);
    const [ ubicacion, setUbicacion] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchPets = async () =>{
            const { data: { user }} = await supabase.auth.getUser();
            if(!user) return;

            const { data: mascotas} = await supabase
                .from("mascotas")
                .select("*")
                .eq("owner_id", user.id);
            setMascotas(mascotas || []);

            if(mascotas && mascotas.length > 0) setSelectedPet(mascotas[0]);

            const { data: ubicacioUser } = await supabase
                .from("localizacion_usuario")
                .select("*")
                .eq("owner_id", user.id)
            setUbicacion(ubicacioUser?.[0] || null);
        };
        fetchPets();
    }, []);

    const handleSelectPet = async (petId) => {
        const pet = mascotas.find((m) => m.id === petId);
        if(!pet) return;
        setSelectedPet(pet);

        const { data } = await supabase
            .from("localizacion")
            .select("*")
            .eq("mascota_id", petId)
            .maybeSingle();
        setLocation(data || null)
    };

    const handleDeletPet = async (pet) =>{
        await supabase.from("mascotas").delete().eq("id", pet.id);
        setMascotas((prev) => prev.filter((m) => m.id !== pet.id));
        setSelectedPet(null)
    }
    

    return(
        <div className="max-w-7xl mx-auto p-0">
            <section className="flex gap-20 mb-10">
                <PetCards
                    pets={mascotas}
                    location={location}
                    selectedPet={selectedPet}
                    setSelectedPet={handleSelectPet}
                    onPetAdded={(newPet) => setMascotas((prev) => [...prev, newPet])}
                />
                <Maps selectedPet={selectedPet} location={location} />
            </section>
            <div className="bg-black w-full h-0.5 my-10"/>
            <section className="mb-5 mt-5">
                <EditPetForm 
                    pets={mascotas} 
                    selectedPet={selectedPet} 
                    location={location}
                    ubicacion={ubicacion}
                    setSelectedPet={(pet) => handleSelectPet(pet.id)} 
                    onEditClick={() => setIsEditModalOpen(true)} 
                    onDeleteClick={() => setIsDeleteModalOpen(true)} 
                />
<<<<<<< HEAD
                <MapsViwer selectedPet={selectedPet} location={location} />
=======
                <MapsViewer selectedPet={selectedPet} location={location} />
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
                <div className="flex gap-10 justify-center items-center">
                    <BtnViaje/>
                    <BtnPetMove/>
                    <BtnEmergency/>
                </div>
            </section>

           {/* Modal de edição */}
            {isEditModalOpen && (
                <ModalEditPet
                pet={selectedPet}
                onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {/* Modal de exclusão */}
            {isDeleteModalOpen && (
                <ModalDeletePet
                pet={selectedPet}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => handleDeletPet(selectedPet)}
                />
            )}
        </div>
    )
}