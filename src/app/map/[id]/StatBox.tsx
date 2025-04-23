import { motion } from "framer-motion";
import "./page.css"
import { JSX } from "react";

interface statColumn {
    name: string;
    onClick?: () => void;
    cols:{
        name: string | JSX.Element;
        onClick?: () => void;
        items: {
            onClick?: () => void;
            icon: any;
            title: string;
            stat: number|string|JSX.Element;
            unit?: string;
        }[];
    }[];
}

const StatBox = ({mapStats}: 
    {mapStats: statColumn}) => {
    return (
    <div className="map-info-container">
        <div className={`map-info-box ${mapStats.onClick? "dark-hover-button" : ""}`} onClick={mapStats.onClick}>
            <div className="map-info-header">{mapStats.name}</div>
            <div className="horizontal-alignment">
                {mapStats.cols.map((col, index) => (
                <div className="typed-map-stat-container" key={index}>
                    <div className={`typed-map-stat-box ${col.onClick? "dark-hover-button" : ""}`} onClick={col.onClick}>
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
                                    className={`map-stat-card  ${stat.onClick? "dark-hover-button" : ""}`}
                                    onClick={stat.onClick}
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

export default StatBox;