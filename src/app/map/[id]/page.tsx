"use client";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

import { PiMapPin } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { FaClock, FaGlobeAmericas, FaRunning, FaMedal } from "react-icons/fa";
import { Md5K } from "react-icons/md";
import { GiNetworkBars } from "react-icons/gi";
import { PiMapPinAreaBold } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CgRowFirst } from "react-icons/cg";

import api from "@/utils/api";
import "./page.css"
import MapPreview from "@/components/maps/MapPreview";
import StatBox from "./StatBox";
import Loading from "@/components/loading";
import { BsCapsule } from "react-icons/bs";
import MapInfoCard from "@/components/maps/info/MapInfoCard";
import ProtectedRoutes from "@/app/ProtectedRoutes";
import { isDemo } from "@/utils/auth";

interface Location {
    lat:number,
    lng:number
}
interface Bounds {
    start: Location,
    end: Location,
}

export default function MapInfoPage(){
    const params = useParams();
    const router = useRouter();

    const [loading,setLoading] = useState(false);
    const [stats,setStats] = useState<any>();
    const [bounds, setBounds] = useState<(Location|Bounds)[]>();
    const [topScore, setTopScore] = useState<any>();
    const [permission, setPermission] = useState<number>(0);


    const demo = isDemo();
    const mapID = params.id;

    const getMapInfo = async () => {
        try {
            const stats = await api.get(`/map/stats?id=${mapID}`);
            setStats(stats.data);
            if (demo){
                setPermission(0);
            }
            else{
                const permission = await api.get(`/map/edit?id=${mapID}`);
                setPermission(permission.data.permission);
            }

            const response = await api.get(`/map/leaderboard?id=${mapID}&page=1&per_page=1`);
            if (response.data.data.length !== 0) {
                setTopScore(response.data.data[0]);
            }
            const bounds = await api.get(`/map/bounds?id=${mapID}`);
            setBounds(bounds.data);
        } catch (error) {
            router.push("/map");
        }
    }

    const mapLeaderboard = () => {
        setLoading(true);
        router.push(`/map/${mapID}/leaderboard`);
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
        return minutes > 0? {stat:`${minutes.toString().padStart(2,"0")}:${seconds.toFixed(1).padStart(4,"0")}`} : {stat:`${seconds}`,unit:"s"};
    }

    const roundNumber = (number:number|string,placements:number) => {
        if(typeof number === "number"){
            return Math.round(number * Math.pow(10,placements)) / Math.pow(10,placements);
        }
        return number;
    }

    const redirectLeaderboard = () => {
        router.push(`/map/${mapID}/leaderboard`);
    }

    useEffect(() => {
        getMapInfo();
    }, []);


    if (!stats || permission === undefined) {
        return <ProtectedRoutes allowDemo={true}><Loading/></ProtectedRoutes>;
    }

    const mapStats = stats.map_stats
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


    const userStats = stats.user_stats;
    const average = userStats ? userStats.average : {score:"N/A",distance:-1,time:-1,guesses:0};
    const high = userStats && userStats.high ? userStats.high : {score:"N/A",distance:-1,time:-1,rounds:"N/A",session:undefined};

    const redirectBestSession = () => {
        if (high && high.session) {
            router.push(`/map/${mapID}/best`);
        }
    }

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
                onClick: high && high.session && redirectBestSession,
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

    
    const topGuesses = stats.other.top_guesses ?? {user:"N/A",stat:"N/A"};
    const fastestnk = stats.other.fastest_5k ?? stats.other.fastest_nk ?? {user:"N/A",stat:-1};
    const most_5ks = stats.other.most_5ks;
    const bestScore = stats.other.highest_score ?? {user:"N/A",stat:"N/A"};

    const otherUserStats = {
        name: "Other User Stats",
        cols: [
            {
                name: "Miscellaneous Stats",
                items: [
                    { icon: <BsCapsule/>, title: `Most Addicted: ${topGuesses.user}`, stat: topGuesses.stat + (stats.other.top_guesses ? " plonks" : "")},
                    { icon: <Md5K/>, title: "Number of 5ks", stat:stats.other["5ks"]},
                    (most_5ks ?
                        (
                            { icon: <FaMedal/>, title: `Most 5ks: ${most_5ks.user}`, stat: most_5ks.stat }
                        ) :
                        (
                            { icon: <CgRowFirst/>, title: `Best Score: ${fastestnk.user}`, stat: bestScore.stat }
                        )
                    ),
                    {icon: <FaRunning/>, title: `Fastest ${most_5ks || bestScore.stat === "N/A" ? "5k" : (Math.floor(bestScore.stat/1000) === 0 ? "Guess" : `${Math.floor(bestScore.stat/1000)}k`)}: ${fastestnk.user}`, ...timeString(fastestnk.stat)}
                ] 
            },
            {
                name: "#1: " + topUser.user,
                onClick: topScore && redirectLeaderboard,
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
        <ProtectedRoutes allowDemo={true}>
            <div className="relative">
                <div className="navbar-buffer"/>
                <button disabled={loading} className="map-search-back-button" onClick={goBack}>
                    <IoMdArrowRoundBack className="map-search-back dark-hover-button"/>
                </button>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="map-info-card-wrapper"
                >
                    <MapInfoCard stats={stats} permission={permission} loading={loading} setLoading={setLoading}>
                        <button disabled={loading} className="map-leaderboard-button map-info-button dark-hover-button gray-disabled" onClick={mapLeaderboard}>
                            <FaMedal className="map-info-button-icon"/>
                            Leaderboard
                        </button>
                    </MapInfoCard>
                </motion.div>
                <StatBox mapStats={displayMapStats}/>
                <StatBox mapStats={displayUserStats} demoBlur={true} demo={demo}/>
                <StatBox mapStats={otherUserStats}/>
                <div className="map-info-container">
                    <div className="map-info-box">
                        <div className="map-info-header">Map Preview</div> 
                        <div className="map-preview-container">
                            {!bounds && <div className="h-[60vh] relative"><Loading/></div>}
                            {bounds && <MapPreview bounds={bounds} iconClick={true}/>}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoutes>
    );
}