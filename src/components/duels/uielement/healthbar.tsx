import "./healthbar.css";
import colorGradient from "@/components/colorGradient";
export default function HealthBar({
    health,
    maxHealth,
    fontSize = "1rem"
}:{
    health: number;
    maxHealth: number;
    fontSize?: string;
}){
    const healthPercentage = health / maxHealth;
    return (
        <div className="duels-health-bar">
            <div 
                className="duels-health-bar-fill" 
                style={{
                    backgroundColor: colorGradient({percent:healthPercentage}),
                    width: `${healthPercentage * 100}%`
                }}
            />
            <div className="duels-health-bar-hp" style={{fontSize}}>{health}</div>
        </div>
    )
}