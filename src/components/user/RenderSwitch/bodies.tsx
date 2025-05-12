import NoBody from "@/components/cosmetics/body/NoBody";
import PurpleShirt from "@/components/cosmetics/body/PurpleShirt";
import { Body } from "@/types/cosmetics/bodies";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";

export function renderBody(body: Body): {
  component: React.ReactElement;
  props: CosmeticProps;
} {
  switch (body) {
    case Body.NO_BODY:
      return { component: <NoBody />, props: { top: 0, left: 0, scale: 1 } };
    case Body.PURPLE_SHIRT:
      return { component: <PurpleShirt />, props: { top: 33, left: 0, scale: 0.79 } };
    default:
      return { component: <NoBody />, props: { top: 0, left: 0, scale: 1 } };
  }
}
