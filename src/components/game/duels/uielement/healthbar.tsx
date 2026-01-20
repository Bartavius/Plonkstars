import "./healthbar.css";
import colorGradient from "@/components/colorGradient";
export default function HealthBar({
    health,
    maxHealth,
    fontSize = "1rem",
    teamInfo,
    prevHealth,
}:{
    health: number;
    maxHealth: number;
    fontSize?: string;
    teamInfo: any,
    prevHealth?: number;

}){

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    function getBrightness(color: number) {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    const healthPercentage = health / maxHealth;
    const healthLost = prevHealth ?  prevHealth-health: 0;
    const brightness = getBrightness(teamInfo.color);
    const color = getColor(teamInfo.color);

    return (
        <div className="duels-health-bar-container">
            <div style={{backgroundColor:color}}className={`duels-health-bar-name ${brightness > 128? "text-black": "text-white"}`}>{teamInfo.name}</div>
            <div style={{backgroundColor:color}} className="duels-health-bar">
                <div 
                    className="duels-health-bar-fill" 
                    style={{
                        backgroundColor: colorGradient({percent:healthPercentage}),
                        width: `${healthPercentage * 100}%`
                    }}
                />
                <div className="duels-health-bar-hp" style={{fontSize}}>{health} {healthLost !== 0 && <div className="duels-health-bar-damage">-{healthLost}</div>}</div>
            </div>
        </div>
    )
}