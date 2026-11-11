import { MapContainer, Polyline, Tooltip } from "react-leaflet";

import type { DuelsGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";
import type { DuelsUser } from "@/features/duels/types/duels-user";

import { FitBounds } from "./fit-bounds";
import { MapTileLayer } from "./map-tile-layer";
import { MapIcon } from "./map-icon";
import "./map.css";
interface DuelsMapResultProps {
  locations: { lat: number; lng: number }[];
  teamGuesses: Record<string, DuelsGuess[][]>;
  teams: Record<string, DuelsTeam>;
  users: Record<string, DuelsUser>;
  createTooltips?: (guess: DuelsGuess) => React.ReactNode;
  showRound?: boolean;
}

function DuelsMapResult({
  locations,
  teamGuesses,
  teams,
  users,
  createTooltips = (guess) => guess.user,
  showRound = false,
}: DuelsMapResultProps) {
  locations.forEach((loc, i) => {
    Object.keys(teamGuesses).forEach((team) => {
      teamGuesses[team][i]?.forEach((guess, j, arr) => {
        let newLng = guess.lng;
        if (guess.lng - loc.lng > 180) {
          newLng = guess.lng - 360;
        } else if (guess.lng - loc.lng < -180) {
          newLng = guess.lng + 360;
        }
        arr[j] = { ...guess, lng: newLng };
      });
    });
  });

  const fit = [
    ...locations,
    ...Object.values(teamGuesses)
      .map((team) => team.map((rounds) => rounds[0]))
      .flat(),
  ].filter((loc) => loc !== undefined);

  return (
    <MapContainer
      zoomDelta={2}
      wheelPxPerZoomLevel={2}
      zoomControl={false}
      className="leaflet-result-map"
    >
      <MapTileLayer size={512} offset={-1} />
      {locations.map((loc, i) => (
        <div key={i}>
          <MapIcon pos={loc} clickable={true} iconUrl="/PlonkStarsMarker.png" iconPercent={1}>
            {showRound ? (
              <Tooltip direction="top" offset={[0, -30]}>
                <b>Round {i + 1}</b>
              </Tooltip>
            ) : undefined}
          </MapIcon>
          {Object.keys(teamGuesses).map((team, j) => (
            <div key={j}>
              {teamGuesses[team][i]?.length > 0 && (
                <Polyline
                  interactive={false}
                  positions={[teamGuesses[team][i][0], loc]}
                  pathOptions={{
                    color: "black",
                    weight: 7,
                    opacity: 1,
                    dashArray: "5, 15",
                  }}
                />
              )}
              {locations.length == 1
                ? teamGuesses[team][i].map((guess, k) => (
                    <MapIcon
                      key={k}
                      pos={guess}
                      customize={{
                        ...users[guess.user].user_cosmetics,
                        team_color: teams[team]?.color,
                      }}
                      iconUrl="/PlonkStarsAvatar.png"
                      iconPercent={1.25}
                    >
                      <Tooltip direction="top" offset={[0, -30]}>
                        {createTooltips(guess)}
                      </Tooltip>
                    </MapIcon>
                  ))
                : teamGuesses[team][i]?.length > 0 && (
                    <MapIcon
                      pos={teamGuesses[team][i][0]}
                      customize={{
                        ...users[teamGuesses[team][i][0].user].user_cosmetics,
                        team_color: teams[team]?.color,
                      }}
                      iconUrl="/PlonkStarsAvatar.png"
                      iconPercent={1.25}
                    >
                      <Tooltip direction="top" offset={[0, -30]}>
                        {createTooltips(teamGuesses[team][i][0])}
                      </Tooltip>
                    </MapIcon>
                  )}
            </div>
          ))}
        </div>
      ))}
      <FitBounds
        locations={fit}
        options={{ paddingTopLeft: [10, 50], paddingBottomRight: [10, 20] }}
        summary={true}
      />
    </MapContainer>
  );
}

export { DuelsMapResult };
