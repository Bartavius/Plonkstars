import { motion } from "framer-motion";
import type { JSX } from "react";

import { LoginTooltipWrapper } from "@/features/auth/components/login-tooltip-wrapper";
interface StatBoxProps {
  mapStats: {
    name: string;
    onClick?: () => void;
    cols: {
      name: string | JSX.Element;
      onClick?: () => void;
      items: {
        onClick?: () => void;
        icon: JSX.Element;
        title: string;
        stat: number | string | JSX.Element;
        unit?: string;
      }[];
    }[];
  };
  demoBlur?: boolean;
  demo?: boolean;
}

function StatBox({ mapStats, demoBlur = false, demo = false }: StatBoxProps) {
  return (
    <div className="p-4 flex flex-col items-center justify-center w-full overflow-hidden">
      <div
        className={`w-[90%] rounded-2xl grow bg-dark-blue flex-col items-center justify-center flex border-4 border-white overflow-hidden ${mapStats.onClick ? "dark-hover-button" : ""}`}
        onClick={mapStats.onClick}
      >
        <div className="pt-4 text-white text-[2rem] font-bold">{mapStats.name}</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] w-full">
          {mapStats.cols.map((col, index) => (
            <div className="flex items-center justify-center w-full p-4" key={index}>
              <div
                className={`p-4 rounded-2xl flex flex-col items-center justify-center bg-theme-blue w-full ${col.onClick ? "dark-hover-button" : ""}`}
                onClick={col.onClick}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.6 }}
                  className="text-[1.5rem] font-bold text-white"
                >
                  {col.name}
                </motion.div>
                <LoginTooltipWrapper
                  demo={demo && demoBlur}
                  message="Login to view your stats"
                  position="center"
                  className="w-full"
                >
                  <div
                    className={`flex flex-col justify-center items-center gap-8 w-full ${demoBlur && demo && "[filter:blur(8px)]"}`}
                  >
                    {col.items.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 + 0.2 * index }}
                        className={`p-4 flex flex-row items-center bg-lighter-blue rounded-2xl w-full  ${stat.onClick ? "dark-hover-button" : ""}`}
                        onClick={stat.onClick}
                      >
                        <div className="text-[gray] [filter:brightness(75%)] pr-4 text-[3rem]">
                          {stat.icon}
                        </div>
                        <div className="flex flex-col [align-items:start] text-left justify-start text-black">
                          <div className="text-[1.2rem] font-bold">{stat.title}</div>
                          <div className="map-stat-stat">
                            {stat.stat}
                            {stat.unit && <span className="map-stat-unit">{stat.unit}</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </LoginTooltipWrapper>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { StatBox };
