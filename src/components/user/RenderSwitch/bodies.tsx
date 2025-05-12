import NoBody from "@/components/cosmetics/body/NoBody";
import PurpleShirt from "@/components/cosmetics/body/PurpleShirt";
import { Body } from "@/types/cosmetics/bodies";
import { CosmeticProps } from "@/types/cosmetics/CosmeticProps";

export function renderBody(body: Body, bodyProps: CosmeticProps) {
    switch (body) {
      case Body.NO_BODY:
        bodyProps.top = 0;
        bodyProps.left = 0;
        bodyProps.scale = 1;
        return <NoBody />;
      case Body.PURPLE_SHIRT:
        bodyProps.top = 33;
        bodyProps.left = 0;
        bodyProps.scale = 0.79;
        return <PurpleShirt />;
      default:
        bodyProps.top = 0;
        bodyProps.left = 0;
        bodyProps.scale = 1;
        return <NoBody />;
    }
  };