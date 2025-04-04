"use client";

import MapLeaderboard from "@/app/map/[id]/leaderboard/leaderboard";
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
    const [canEdit, setCanEdit] = useState(false);
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
            const can_edit = await api.get(`/map/edit?id=${mapID}`);
            setCanEdit(can_edit.data.can_edit);
            setLoading(false);
        } catch (error) {
            router.push("/map");
        }
    }

    useEffect(() => {
        getMapInfo();
    }, []);


    if (!stats || canEdit === undefined || loading === undefined) {
        return <Loading/>;
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
                <MapInfoCard stats={stats} canEdit={canEdit} loading={loading} setLoading={setLoading}>
                    <button disabled={loading} className="leaderboard-button map-info-button gray-button" onClick={mapStats}>
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