"use client";
import { useParams,useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { motion } from 'framer-motion';

import { PiMapPin } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { FaClock,FaGlobeAmericas } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { PiMapPinAreaBold } from "react-icons/pi";

import { setGameMap } from "@/redux/gameSlice";
import api from "@/utils/api";
import "./page.css"
import { useDispatch } from "react-redux";
import MapPreview from "@/components/maps/MapPreview";

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
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
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

    const playMap = () => {
        if(data && mapID){
            setLoading(true)
            dispatch(setGameMap({mapName:data.name,mapId:mapID}));
            router.push("/game");
        }
        setLoading(false);
    } 

    const distanceString = (distance:number) => {
        const m = Math.round(distance * 1000);
        const km = Math.round(m / 10) / 100;
        const num = km > 1 ? km : m;
        const units = km > 1 ? "km" : "m";
        return {num,units};
    }

    const timeString = (time:number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60);
        return minutes > 0? {stat:`${minutes}:${seconds}`} : {stat:`${seconds}`,unit:"s"};
    }

    useEffect(() => {
        getMapInfo();
    }, []);


    if (!data) {
        return <div>Loading...</div>;
    }


    console.log(data);

    const genTime = timeString(data.average_generation_time);
    const averageTime = timeString(data.average_time);
    const maxDistance = distanceString(data.max_distance)
    const averageDistance = distanceString(data.average_distance)

    const mapStats = [
        { icon: <FaGlobeAmericas/>, title: "Total Guesses", stat: data.total_guesses },
        { icon: <FaClock/>, title: "Average Generation Time", stat: genTime.stat, unit: genTime.unit? genTime.unit : undefined },
        { icon: <PiMapPinAreaBold />, title: "Max Distance", stat: maxDistance.num, unit: maxDistance.units },
    ]

    const guessStats = [
        { icon: <GiNetworkBars/>, title: "Average Score", stat: Math.round(data.average_score * 100)/100},
        { icon: <PiMapPin/>, title: "Average Distance", stat: averageDistance.num, unit: averageDistance.units },
        { icon: <IoTimerOutline/>, title: "Average Time", stat: averageTime.stat, unit:averageTime.unit? averageTime.unit : undefined }
    ]
    return (
        <div>
            <div className="navbar-buffer"/>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="map-info-card-wrapper"
            >
                <div className="map-info-card">
                    <div className="map-info-title">{data.name}</div>
                    <div className="map-info-creator">Made by: <span className="map-info-creator-name">{data.creator.username}</span></div>
                    <button disabled={loading} className="play-button" onClick={playMap}>Play</button>
                </div>
            </motion.div>
            <div className="map-stat-container">
                <div className="map-stat-box">
                    <div className="map-info-header">Statistics</div>
                    <div className="horizontal-alignment">
                        <div className="typed-map-stat-container">
                            <div className="typed-map-stat-box">
                                <motion.div 
                                    initial={{ opacity: 0}}
                                    animate={{ opacity: 1}}
                                    transition={{ duration: 1.6 }}
                                    className="map-stat-header"
                                >
                                    Map Statistics
                                </motion.div>
                                <div className="map-stat-grid">
                                    {mapStats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 + 0.2*index }}
                                            className="map-stat-card"
                                        >
                                            <div className="map-stat-icon">{stat.icon}</div>
                                            <div className="map-stat-text">
                                                <div className="map-stat-title">{stat.title}</div>
                                                <div className="map-stat-stat">{stat.stat}{stat.unit && <span className="map-stat-unit">{stat.unit}</span>}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="typed-map-stat-container">
                            <div className="typed-map-stat-box">
                                <motion.div 
                                    initial={{ opacity: 0}}
                                    animate={{ opacity: 1}}
                                    transition={{ duration: 1.6 }}
                                    className="map-stat-header"
                                >
                                    Guess Statistics
                                </motion.div>
                                <div className="map-stat-grid">
                                    {guessStats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 + 0.2*index }}
                                            className="map-stat-card"
                                        >
                                            <div className="map-stat-icon">{stat.icon}</div>
                                            <div className="map-stat-text">
                                                <div className="map-stat-title">{stat.title}</div>
                                                <div className="map-stat-stat">{stat.stat}{stat.unit && <span className="map-stat-unit">{stat.unit}</span>}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MapPreview bounds={data.bounds}/>
        </div>
    );
}