export default function UserIcon({
  data,
  className,
}: {
  data: any;
  className?: string;
}) {
  const face = data.face;
  const hat = data.hat;
  const body = data.body;

  return (
    <div className={className ? className : "w-full"}>
      <div className="relative flex justify-center items-center w-full h-full">
        <img
          src="/PlonkStarsAvatar.svg"
          style={{
            filter: `hue-rotate(${data.hue}deg) saturate(${data.saturation}%) brightness(${data.brightness}%)`,
          }}
          alt=""
        />

        {/* faces */}
        {face && (
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{
              top: `${face.top_position}%`,
              left: `${face.left_position}%`,
              transform: `scale(${face.scale})`,
            }}
          >
            <img src={`/cosmetics/FACE/${face.image}`} alt={face.item_name} />
          </div>
        )}

        {/* body */}
        {body && (
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{
              top: `${body.top_position}%`,
              left: `${body.left_position}%`,
              transform: `scale(${body.scale})`,
            }}
          >
            <img src={`/cosmetics/BODY/${body.image}`} alt={body.item_name} />
          </div>
        )}

        {/* hats */}
        {hat && (
          <div
            className="absolute flex justify-center items-center w-full h-full"
            style={{
              top: `${hat.top_position}%`,
              left: `${hat.left_position}%`,
              transform: `scale(${hat.scale})`,
            }}
          >
            <img src={`/cosmetics/HAT/${hat.image}`} alt={hat.item_name} />
          </div>
        )}
      </div>
    </div>
  );
}
