export default function UserIcon({
    data,
    className,
  }: {
    data: any;
    className?: string;
  }) {
    if ("user_cosmetics" in data){
      data = data.user_cosmetics;
    }

    function getColor(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`
    }

    const face = data.face;
    const hat = data.hat;
    const body = data.body;
    const teamColor = data.team_color ? getColor(data.team_color) : undefined;
    
  
    return (
      <div 
        className={`${className ? className : "w-full h-full"}`}
        
      >
        <div className="relative flex justify-center items-center w-full h-full">
          {/* Base Avatar */}
          <img
            src="/PlonkStarsAvatar.png"
            style={{
    filter: `hue-rotate(${data.hue}deg) saturate(${data.saturation}%) brightness(${data.brightness}%) ${teamColor ? `
      drop-shadow(0px 0px 1px ${teamColor})
      drop-shadow(0px 0px 2px ${teamColor})
    ` : ""}`,
  }}
            alt=""
            className="w-full h-full pixelated"
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
              <img
                src={`/cosmetics/FACE/${face.image}`}
                alt={face.item_name}
                className="object-contain w-full h-full pixelated"
              />
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
              <img
                src={`/cosmetics/BODY/${body.image}`}
                alt={body.item_name}
                className="object-contain w-full h-full pixelated"
              />
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
              <img
                src={`/cosmetics/HAT/${hat.image}`}
                alt={hat.item_name}
                className="object-contain w-full h-full pixelated"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  