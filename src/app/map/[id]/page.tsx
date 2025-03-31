"use client";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

import { PiMapPin } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { FaClock,FaGlobeAmericas,FaPlay,FaPencilAlt, FaRunning, FaMedal } from "react-icons/fa";
import { Md5K } from "react-icons/md";
import { GiNetworkBars } from "react-icons/gi";
import { PiMapPinAreaBold } from "react-icons/pi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CgRowFirst } from "react-icons/cg";

import { setGameMap } from "@/redux/gameSlice";
import api from "@/utils/api";
import "./page.css"
import { useDispatch } from "react-redux";
import MapPreview from "@/components/maps/MapPreview";
import StatBox from "./StatBox";
import Loading from "@/components/loading";
import { BsCapsule } from "react-icons/bs";

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
    const dispatch = useDispatch();

    const [loading,setLoading] = useState(false);
    const [stats,setStats] = useState<any>();
    const [bounds, setBounds] = useState<(Location|Bounds)[]>();
    const [topScore, setTopScore] = useState<any>();
    const [canEdit, setCanEdit] = useState<boolean>();
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState<string>();

    const mapID = params.id;

    const getMapInfo = async () => {
        try {
            const stats = await api.get(`/map/stats?id=${mapID}`);
            setStats(stats.data);
            setDescription(stats.data.description);
            const can_edit = await api.get(`/map/edit?id=${mapID}`);
            setCanEdit(can_edit.data.can_edit);

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

    const playMap = () => {
        if(stats && mapID){
            setLoading(true);
            dispatch(setGameMap({mapName:stats.name,mapId:mapID}));
            router.push("/game");
        }
        setLoading(false);
    } 

    const editMap = () => {
        if(stats && mapID){
            setLoading(true);
            router.push(`/map/${mapID}/edit`);
        }
        setLoading(false)
    }

    const goBack = () => {
        setLoading(true);
        router.push("/map");
    }

    const mapLeaderboard = () => {
        setLoading(true);
        router.push(`/map/${mapID}/leaderboard`);
    }
    
    const editDescription = async () => {
        const res = await api.post(`/map/edit/description`,{description,id:mapID});
        if(res.status === 200){
            setDescription(description);
        }
        else{
            setDescription(stats.description);
        }
        setEditing(false);
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


    if (!stats || canEdit === undefined) {
        return <Loading/>;
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

    
    const topGuesses = stats.other.top_guesses ?? {user:{username:"N/A"},stat:"N/A"};
    const fastestPlonker = stats.other.fast_guesser ?? {user:{username:"N/A"},stat:-1};
    const bestAverage = stats.other.best_average ?? {user:{username:"N/A"},stat:"N/A"};

    if (typeof bestAverage.stat === "number") {
        bestAverage.stat = roundNumber(bestAverage.stat,2);
    }

    const otherUserStats = {
        name: "Other User Stats",
        cols: [
            {
                name: "Miscellaneous Stats",
                items: [
                    { icon: <BsCapsule/>, title: `Most Addicted: ${topGuesses.user.username}`, stat: topGuesses.stat + (stats.other.top_guesses ? " plonks" : "")},
                    { icon: <FaRunning/>, title: `Fastest Plonker: ${fastestPlonker.user.username}`, ...timeString(fastestPlonker.stat) },
                    { icon: <CgRowFirst/>, title: `Best Average: ${bestAverage.user.username}`, stat: bestAverage.stat },
                    { icon: <Md5K/>, title: "Number of 5ks", stat:stats.other["5ks"]},
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

    console.log(editing);

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
                    <div className="map-info-title">{stats.name}</div>
                    <div className="map-info-creator">Made by: <span className="map-info-creator-name">{stats.creator.username}</span></div>
                    <div className="map-info-description-button">
                        {description && !editing &&
                            <div className="map-info-description">
                                <div className="map-info-description-text">{description}</div>
                            </div>
                        }
                        {editing && 
                            <div className="map-info-description-editing">
                                <textarea className="map-info-description-textbox" defaultValue={stats.description ?? ""} onChange={(e) => setDescription(e.target.value)}/>
                                <button onClick={editDescription}>Save</button>
                            </div>
                        }
                        <div className="map-info-button-div">
                            <button disabled={loading} className="play-button map-info-button gray-button" onClick={playMap}>
                                <FaPlay className="map-info-button-icon"/>
                                Play
                            </button>
                            {canEdit && 
                                <button disabled={loading} className="edit-button map-info-button gray-button" onClick={editMap}>
                                    <FaPencilAlt className="map-info-button-icon"/>
                                    Edit
                                </button>}
                            <button disabled={loading} className="leaderboard-button map-info-button gray-button" onClick={mapLeaderboard}>
                                <FaMedal className="map-info-button-icon"/>
                                Leaderboard
                            </button>
                        </div>
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
                        {!bounds && <div className="h-[60vh] relative"><Loading/></div>}
                        {bounds && <MapPreview bounds={bounds} iconClick={true}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}