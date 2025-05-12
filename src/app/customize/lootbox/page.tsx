import Lootbox from "@/components/cosmetics/lootbox";

export default function Page() {

    // TODO: this will be a placeholder just to display tiers for now
    const tier = "legendary"; // This will be replaced with actual tier data

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Lootbox</h1>
            <p className="text-lg">This is the Lootbox component.</p>
            <Lootbox tier={tier}/>
            <span className="text-5xl text-white">{tier}</span>
        </div>
    )
}