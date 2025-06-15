interface Color {
    r: number;
    g: number;
    b: number;
}
export default function colorGradient({
    colors=[{r: 255, g: 0, b: 0},
    {r: 255, g: 255, b: 0},
    {r: 0, g:255, b: 0}],
    percent,
}:{
    colors?: Color[],
    percent: number
}){
    if(percent < 0 || percent > 1){
        throw new Error("Percent must be between 0 and 1");
    }

    if (percent == 1){
        const lastColor = colors[colors.length - 1];
        return `rgb(${lastColor.r}, ${lastColor.g}, ${lastColor.b})`;
    }

    const segmentLength = 1 / (colors.length - 1);
    const segmentIndex = Math.floor(percent / segmentLength);
    const segmentPercent = (percent - segmentIndex * segmentLength) / segmentLength;

    const startColor = colors[segmentIndex];
    const endColor = colors[segmentIndex + 1];

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * segmentPercent);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * segmentPercent);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * segmentPercent);

    return `rgb(${r}, ${g}, ${b})`;
}