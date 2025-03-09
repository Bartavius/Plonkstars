"use client";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface Location {
    lat:number,
    lng:number
}

interface MapInfo{
    name:string,
    id:string, 
    creator:{username:string},
    average_generation_time: number,
    average_score: number,
    average_distance: number,
    average_time: number,
    total_guesses: number,
    max_distance: number
    bounds:{start:Location,end:Location}[],
}

export default function MapInfoPage(){
    const params = useParams();
    const router = useRouter();
    const [data,setData] = useState<MapInfo>();

    const mapID = params.id;

    const getMapInfo = async () => {
        try {
            const response = await api.get(`/map/info?id=${mapID}`);
            setData(response.data);
        } catch (error) {
            sessionStorage.setItem("error", String(error));
            router.push("/map");
        }
    }

    useEffect(() => {
        getMapInfo();
    }, []);


    if (!data) {
        return <div>Loading...</div>;
    }

    console.log(data);

    return (
        <div>
            <div className="navbar-buffer"/>
            <div>How did you even find this, there are no direct link to this page. Page unfinished at the moment, but will be done in the near future.</div>
            <div>Here is the json returned from the backend if you are curious:</div>
            <pre>{JSON.stringify(data,null,2)}</pre>
        </div>
    );
}