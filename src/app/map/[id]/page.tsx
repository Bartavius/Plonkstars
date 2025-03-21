"use client";
import { useParams,useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { motion } from 'framer-motion';

import { PiMapPin } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { FaClock,FaGlobeAmericas,FaPlay,FaPencilAlt } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { PiMapPinAreaBold } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";

import { setGameMap } from "@/redux/gameSlice";
import api from "@/utils/api";
import "./page.css"
import { useDispatch } from "react-redux";
import MapPreview from "@/components/maps/MapPreview";
import StatBox from "./StatBox";
import Loading from "@/components/loading";

interface Location {
    lat:number,
    lng:number
}

interface MapInfo{
    name:string,
    id:string, 
    creator:{username:string},
    can_edit:boolean,
    map_stats:{
        average_generation_time: number,
        average_score: number,
        average_distance: number,
        average_time: number,
        total_guesses: number,
        max_distance: number
    },
    user_stats?:{
        average:{
            score:number,
            distance:number,
            time:number,
            guesses:number,
        }
        high?:{
            score:number,
            distance:number,
            time:number,
            rounds:number,
            session: string
        }
    }
    bounds:{start:Location,end:Location}[],
}

export default function MapInfoPage(){
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState<MapInfo>();
    const [topScore, setTopScore] = useState<any>();

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

    const getTopScore = async () => {
        try {
            const response = await api.get(`/map/leaderboard?id=${mapID}&page=1&per_page=1`);
            if (response.data.length !== 0) {
                setTopScore(response.data[0]);
            }
        } catch (error) {
            // sessionStorage.setItem("error", String(error));
            // router.push("/map");
        }
    }

    const playMap = () => {
        if(data && mapID){
            setLoading(true);
            dispatch(setGameMap({mapName:data.name,mapId:mapID}));
            router.push("/game");
        }
        setLoading(false);
    } 

    const editMap = () => {
        if(data && mapID){
            setLoading(true);
            router.push(`/map/${mapID}/edit`);
        }
        setLoading(false)
    }

    const goBack = () => {
        setLoading(true);
        router.push("/map");
    }
    

    const distanceString = (distance:number) => {
        if(distance < 0) return {stat: "N/A"};
        const m = Math.round(distance * 1000);
        const km = Math.round(m / 10) / 100;
        const num = km > 1 ? km : m;
        const unit = km > 1 ? "km" : "m";
        return {stat:num,unit};
    }

    const timeString = (time:number) => {
        if(time < 0) return {stat:"N/A"};
        const minutes = Math.floor(time / 60);
        const seconds = Math.round(time % 60 * 10)/10;
        return minutes > 0? {stat:`${minutes}:${seconds.toString().padStart(4,"0")}`} : {stat:`${seconds}`,unit:"s"};
    }

    const roundNumber = (number:number|string,placements:number) => {
        if(typeof number === "number"){
            return Math.round(number * Math.pow(10,placements)) / Math.pow(10,placements);
        }
        return number;
    }

    useEffect(() => {
        getMapInfo();
        getTopScore();
    }, []);


    if (!data) {
        return <Loading/>;
    }

    const mapStats = data.map_stats
    const displayMapStats = {
        name: "Overall Stats",
        cols:[
            {
                name: "Map Statistics",
                items:[
                    { icon: <FaGlobeAmericas/>, title: "Total Guesses", stat: mapStats.total_guesses },
                    { icon: <FaClock/>, title: "Average Generation Time", ...timeString(mapStats.average_generation_time) },
                    { icon: <PiMapPinAreaBold />, title: "Max Distance", ...distanceString(mapStats.max_distance) },
                ]
            },
            {
                name: "Guess Statistics",
                items:[
                    { icon: <GiNetworkBars/>, title: "Average Score", stat: roundNumber(mapStats.average_score,2)},
                    { icon: <PiMapPin/>, title: "Average Distance", ...distanceString(mapStats.average_distance) },
                    { icon: <IoTimerOutline/>, title: "Average Time", ...timeString(mapStats.average_time)}
                ]
            }
        ]
    }


    const userStats = data.user_stats;
    const average = userStats ? userStats.average : {score:"N/A",distance:-1,time:-1,guesses:0};
    const high = userStats && userStats.high ? userStats.high : {score:"N/A",distance:-1,time:-1,rounds:"N/A",session:undefined};

    const displayUserStats = {
        name: "Your Stats",
        cols: [
            {
                name: "Average Performance",
                items: [
                    { icon: <FaGlobeAmericas/>, title: "Guesses", stat: average.guesses },
                    { icon: <GiNetworkBars/>, title: "Average Score", stat: roundNumber(average.score,2) },
                    { icon: <PiMapPin/>, title: "Average Distance", ...distanceString(average.distance) },
                    { icon: <IoTimerOutline/>, title: "Average Time", ...timeString(average.time) },
                ]
            },
            {
                name: "Best Performance",
                link: high && high.session ? `/game/${high.session}/summary` : undefined,
                items: [
                    { icon: <FaGlobeAmericas/>, title: "Rounds", stat: high.rounds },
                    { icon: <GiNetworkBars/>, title: "Average Score", stat:roundNumber(high.score,2) },
                    { icon: <PiMapPin/>, title: "Average Distance", ...distanceString(high.distance) },
                    { icon: <IoTimerOutline/>, title: "Average Time", ...timeString(high.time) },
                ]
            }
        ]
    }

    const topUser = topScore ? {
        user:topScore.user.username,
        score:topScore.average_score,
        distance:topScore.average_distance,
        time:topScore.average_time,
        rounds: topScore.rounds,
    } : {user:"N/A",score:"N/A",distance:-1,time:-1,rounds:"N/A"};
    const otherUserStats = {
        name: "Other User Stats",
        cols: [
            {
                name: "#1: " + topUser.user,
                items: [
                    { icon: <GiNetworkBars/>, title: "Average Score", stat:roundNumber(topUser.score,2) },
                    { icon: <FaGlobeAmericas/>, title: "Rounds", stat: topUser.rounds},
                    { icon: <IoTimerOutline/>, title: "Average Time", ...timeString(topUser.time) },
                    { icon: <PiMapPin/>, title: "Average Distance", ...distanceString(topUser.distance) },
                ]
            },
        ]
    }

    return (
        <div className="relative">
            <div className="navbar-buffer"/>
            <button disabled={loading} className="map-search-back-button" onClick={goBack}>
                <IoMdArrowRoundBack className="map-search-back mouse-pointer"/>
            </button>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="map-info-card-wrapper"
            >
                <div className="map-info-card">
                    <div className="map-info-title">{data.name}</div>
                    <div className="map-info-creator">Made by: <span className="map-info-creator-name">{data.creator.username}</span></div>
                    <div className="map-info-button-div">
                        <button disabled={loading} className="play-button map-info-button gray-button" onClick={playMap}>
                            <FaPlay className="map-info-button-icon"/>
                            Play
                            </button>
                        {data.can_edit && 
                            <button className="edit-button map-info-button gray-button" onClick={editMap}>
                                <FaPencilAlt className="map-info-button-icon"/>
                                Edit
                            </button>}
                    </div>
                </div>
            </motion.div>
            <StatBox mapStats={displayMapStats}/>
            <StatBox mapStats={displayUserStats}/>
            <StatBox mapStats={otherUserStats}/>
            <div className="map-info-container">
                <div className="map-info-box">
                    <div className="map-info-header">Map Preview</div> 
                    <div className="map-preview-container">
                        <MapPreview bounds={data.bounds} iconClick={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}