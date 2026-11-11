"use client";

/* eslint-disable import/order -- Sorting these imports would reorder stylesheets, since
   CSS loads in import order. See "Imports" in CLAUDE.md. */
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosStats, IoMdArrowRoundBack } from "react-icons/io";

import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { isDemo } from "@/features/auth/services/session";
import { api } from "@/services/api";

import { MapLeaderboard } from "./_components/leaderboard";

import "./page.css";
import { Loading } from "@/components/primitives/loading";
import { MapInfoCard } from "@/features/maps/components/map-info-card";
import type { MapStats } from "@/features/maps/types/map-stats";

export default function MapLeaderboardPage() {
  const [stats, setStats] = useState<MapStats>();
  const [loading, setLoading] = useState<boolean>();
  const [permission, setPermission] = useState<number>(0);
  const mapID = useParams().id ?? "";
  const router = useRouter();

  const demo = isDemo();

  const mapStats = () => {
    setLoading(true);
    router.push(`/map/${mapID}`);
  };

  const goBack = () => {
    setLoading(true);
    router.push("/map");
  };

  const getMapInfo = async () => {
    try {
      const stats = await api.get<MapStats>(`/map/stats?id=${mapID}`);
      setStats(stats.data);
      if (demo) {
        setPermission(0);
      } else {
        const permission = await api.get(`/map/edit?id=${mapID}`);
        setPermission(permission.data.permission);
      }
      setLoading(false);
    } catch (error) {
      router.push("/map");
    }
  };

  useEffect(() => {
    getMapInfo();
  }, []);

  if (!stats || loading === undefined) {
    return (
      <ProtectedRoutes allowDemo={true}>
        <Loading />
      </ProtectedRoutes>
    );
  }

  return (
    <ProtectedRoutes allowDemo={true}>
      <div className="relative">
        <div className="navbar-buffer" />
        <button
          disabled={loading}
          className="absolute ml-12 mt-8 text-[3rem] text-white hover:cursor-pointer hover:[filter:brightness(90%)] disabled:text-[gray]"
          onClick={goBack}
        >
          <IoMdArrowRoundBack className="map-search-back dark-hover-button" />
        </button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="p-12 flex items-center justify-center w-full"
        >
          <MapInfoCard
            stats={stats}
            permission={permission}
            loading={loading}
            setLoading={setLoading}
          >
            <button
              disabled={loading}
              className="bg-leaderboard-yellow flex items-center justify-center flex-row text-[1.5rem] font-bold text-white px-6 rounded-2xl dark-hover-button gray-disabled"
              onClick={mapStats}
            >
              <IoIosStats className="text-[1rem] mr-2" />
              Stats
            </button>
          </MapInfoCard>
        </motion.div>
        <div className="flex justify-center items-center w-full h-full">
          <div className="pt-4 text-white text-[2rem] font-bold">Leaderboard</div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-[90%] bg-dark-blue rounded-2xl p-4 relative">
            <MapLeaderboard mapID={mapID.toString()} />
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  );
}
