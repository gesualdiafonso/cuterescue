import React, {useEffect, useState} from "react"
import PetCards from "../components/ui/PetCards"
import DetailsInform from "../components/DetailsInform"
import { supabase } from "../../services/supabase"
import { useNavigate } from "react-router-dom"



export default function DetailsUser(){

    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [mascotas, setMascotas] = useState(null)

    useEffect(() => {
        const fetchAllData = async () => {
            const { data: { user }} = await supabase.auth.getUser();
            if(!user){
                navigate("/login");
                return;
            }
            const { data: { userInfo }} = await supabase
                .from("usuarios")
                .select("*")
                .eq("id", user.id)
                .single()

            setUserData(userInfo)

            const { data: { petsData }} = await supabase
                .from("mascotas")
                .select("*")
                .eq("owner_id", user.id)

            setMascotas(petsData);
        }

        fetchAllData();
    }, [navigate]);
    
     

    return(
        <div className="max-w-7xl mx-auto">
            <section>
                <DetailsInform details={userData} />
            </section>
            <div className="bg-gray-300/50 w-full h-px my-10" />
            <section>
                <PetCards
                    pets={mascotas}
                    
                    />
            </section>
        </div>
    )
}