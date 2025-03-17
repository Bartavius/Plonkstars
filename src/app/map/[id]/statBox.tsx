'use client';
import { motion } from "framer-motion";
import "./page.css"
import { JSX } from "react";
import { useRouter } from "next/navigation";

interface statColumn {
    name: string;
    link?: string;
    cols:{
        name: string | JSX.Element;
        link?: string;
        items: {
            link?: string;
            icon: any;
            title: string;
            stat: number|string;
            unit?: string;
        }[];
    }[];
}

export default function StatBox({mapStats}: 
    {mapStats: statColumn}) {
    const router = useRouter();
    return (
    <div className="map-info-container">
        <div className={`map-info-box ${mapStats.link? "mouse-pointer" : ""}`} onClick={() => mapStats.link ? router.push(mapStats.link) : undefined}>
            <div className="map-info-header">{mapStats.name}</div>
            <div className="horizontal-alignment">
                {mapStats.cols.map((col, index) => (
                <div className="typed-map-stat-container" key={index}>
                    <div className={`typed-map-stat-box ${col.link? "mouse-pointer" : ""}`} onClick={() => col.link ? router.push(col.link) : undefined}>
                        <motion.div 
                            initial={{ opacity: 0}}
                            animate={{ opacity: 1}}
                            transition={{ duration: 1.6 }}
                            className="map-stat-header"
                        >
                            {col.name}
                        </motion.div>
                        <div className="map-stat-grid">
                            {col.items.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 + 0.2*index }}
                                    className={`map-stat-card  ${stat.link? "mouse-pointer" : ""}`}
                                    onClick={() => stat.link ? router.push(stat.link) : undefined}
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
                ))}
            </div>
        </div>
    </div>
);}