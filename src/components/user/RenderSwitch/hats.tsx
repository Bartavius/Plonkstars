import Fedora from "@/components/cosmetics/hats/Fedora";
import NoHat from "@/components/cosmetics/hats/NoHat";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { Hat } from "@/types/cosmetics/hats";

export function renderHat(hat: Hat, hatProps: CosmeticProps) {
    switch (hat) {
      case Hat.NO_HAT:
        hatProps.top = 0;
        hatProps.left = 0;
        hatProps.scale = 1;
        return <NoHat />;
      case Hat.FEDORA:
        hatProps.top = -45;
        hatProps.left = 0;
        hatProps.scale = 1.6;
        return <Fedora />;
      default:
        hatProps.top = 0;
        hatProps.left = 0;
        hatProps.scale = 1;
        return <NoHat />;
    }
  };