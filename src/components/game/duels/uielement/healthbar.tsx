import "./healthbar.css";
import colorGradient from "@/components/colorGradient";
export default function HealthBar({
    health,
    maxHealth,
    fontSize = "1rem",
    teamInfo,
    users,
    prevHealth,
}:{
    health: number;
    maxHealth: number;
    fontSize?: string;
    teamInfo: any,
    users?: {[key: string]: any};
    prevHealth?: number;

}){
    const healthPercentage = health / maxHealth;
    const healthLost = prevHealth ?  prevHealth-health: 0;
    return (
        <div className="duels-health-bar-container">
            <div className="duels-health-bar-name">{teamInfo.name}</div>
            <div className="duels-health-bar">
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