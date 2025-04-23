"use client";

import MapLeaderboard from "./leaderboard";
import { useParams, useRouter } from "next/navigation";
import "../page.css";
import "./page.css";
import { IoIosStats, IoMdArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Loading from "@/components/loading";
import MapInfoCard from "../MapInfoCard";

export default function MapLeaderboardPage(){
    const [stats, setStats] = useState<any>();
    const [loading, setLoading] = useState<boolean>();
    const [permission, setPermission] = useState<number>(0);
    const mapID = useParams().id ?? "";
    const router = useRouter();

    const mapStats = () => {
        setLoading(true);
        router.push(`/map/${mapID}`);
    }

    const goBack = () => {
        setLoading(true);
        router.push("/map");
    }

    const getMapInfo = async () => {
        try {
            const stats = await api.get(`/map/stats?id=${mapID}`);
            setStats(stats.data);
            const permission = await api.get(`/map/edit?id=${mapID}`);
            setPermission(permission.data.permission);
            setLoading(false);
        } catch (error) {
            router.push("/map");
        }
    }

    useEffect(() => {
        getMapInfo();
    }, []);


    if (!stats || loading === undefined) {
        return <Loading/>;
    }

    return (
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
                    <button disabled={loading} className="map-leaderboard-button map-info-button dark-hover-button gray-disabled" onClick={mapStats}>
                        <IoIosStats className="map-info-button-icon"/>
                        Stats
                    </button>
                </MapInfoCard>
            </motion.div>
            <div className="title-header-wrapper">
                <div className="title-header">Leaderboard</div>
            </div>
            <div className="map-leaderboard-wrapper">
                <div className="map-leaderboard-box relative">
                    <MapLeaderboard mapID={mapID.toString()}/>
                </div>
            </div>
        </div>
    )
}