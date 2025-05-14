import { CosmeticTiers } from "@/types/CosmeticTiers";


const tierColors: Record<CosmeticTiers, { base: string; lid: string; lock: string }> = {
  COMMON: {
    base: '#8B4513',   // brown
    lid: '#A0522D',
    lock: '#C0C0C0',   // silver
  },
  UNCOMMON: {
    base: '#228B22',   // forest green
    lid: '#32CD32',    // lime green
    lock: '#C0C0C0',
  },
  RARE: {
    base: '#1E90FF',   // dodger blue
    lid: '#00BFFF',    // deep sky blue
    lock: '#FFD700',   // gold
  },
  EPIC: {
    base: '#800080',   // purple
    lid: '#BA55D3',    // orchid
    lock: '#FFD700',
  },
  LEGENDARY: {
    base: '#FF8C00',   // dark orange
    lid: '#FFA500',    // orange
    lock: '#FFD700',
  },
};

interface LootboxProps {
  tier: CosmeticTiers;
}

export default function Lootbox({ tier }: LootboxProps) {
  const colors = tierColors[tier];

  return (
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        width="256"
        height="256"
      >
        {/* Chest base */}
        <rect x="8" y="32" width="48" height="24" fill={colors.base} />
        <rect x="12" y="36" width="40" height="16" fill={colors.lid} />
        <rect x="28" y="44" width="8" height="8" fill={colors.lock} />

        {/* Chest lid */}
        <rect x="8" y="16" width="48" height="16" fill={colors.base} />
        <rect x="12" y="20" width="40" height="8" fill={colors.lid} />


      </svg>
  );
}