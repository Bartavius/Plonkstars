import Fedora from "@/components/cosmetics/hats/Fedora";
import NoHat from "@/components/cosmetics/hats/NoHat";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";
import { Hat } from "@/types/cosmetics/Hats";

export function renderHat(hat: Hat): {
  component: React.ReactElement;
  props: CosmeticProps;
} {
  switch (hat) {
    case Hat.NO_HAT:
      return { component: <NoHat />, props: { top: 0, left: 0, scale: 1 } };
    case Hat.FEDORA:
      return { component: <Fedora />, props: { top: -45, left: 0, scale: 1.6 } };
    default:
      return { component: <NoHat />, props: { top: 0, left: 0, scale: 1 } };
  }
}
