import React, {useEffect, useState} from "react"
import PetCards from "../components/ui/PetsCard"
import DetailsInform from "../components/DetailsInform"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase";


export default function DetailsUser(){
    
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const [ubicacion, setUbicacion] = useState(null);
    
    useEffect(() =>{
        const fetchAllData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user){
                navigate("/login")
                return;
            }

            const { data: detailsUser} = await supabase
                .from("usuarios")
                .select("*")
                .eq("id", user.id)
                .single();
            setUserData(detailsUser)

            const { data: mascotesInfo} = await supabase
                .from("mascotas")
                .select("*")
                .eq("owner_id", user.id);

            setMascotas(mascotesInfo);

            const { data: userUbication } = await supabase
                .from("localizacion_usuario")
                .select("*")
                .eq("owner_id", user.id)
                .single()
            setUbicacion(userUbication)
        }

        fetchAllData();
    }, [navigate])

    return(
        <div className="max-w-7xl mx-auto">
            <section>
                <DetailsInform details={userData} ubicacion={ubicacion}/>
            </section>
            <div className="bg-black w-full h-0.5 my-10"/>
            <section>
                <PetCards
                    pets={mascotas}
     
                    />
            </section>
        </div>
    )
}