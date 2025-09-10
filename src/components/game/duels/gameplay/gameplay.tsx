import CombinedMap from "@/components/maps/CombinedMap";
import TeamGuessingMap from "@/components/maps/TeamGuessingMap";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import "@/app/game.css";
import DuelsUIOverlay from "../uielement/mapUIOverlay";

export default function DuelsGameplay({
    id,
    users,
    thisUser,
    teams,
    teamPlonks,
    teamGuesses,
    roundInfo,
    spectator,
    canGuess,
    guesses,
    maxGuesses,
    multi,
    maxHealth,
    endTime,
    timeLimit,
    timeOffset=0,
}: {
    id: string,
    users: {[key: string]: any},
    thisUser: string,
    teams: {[key: string]: any},
    teamPlonks: {[key: string]: any},
    teamGuesses: {[key: string]: any},
    roundInfo: any,
    spectator?: boolean,
    canGuess?: boolean,
    guesses: number,
    maxGuesses: number,
    multi: number,
    maxHealth: number,
    endTime?: Date,
    timeLimit?: number,
    timeOffset?: number,
}) {
    const [guessed, setGuessed] = useState<boolean>(canGuess === false);
    const [reload, setReload] = useState<number>(0);
    const [rightTeamIndex, setrightTeamIndex] = useState<number>(0);

    const thisTeam = users[thisUser]?.team ?? Object.keys(teams).reduce((bestTeam: string | undefined, team) => {
        if(!bestTeam){
            return team;
        }
        if(teams[bestTeam].hp < teams[team].hp){
            return team;
        }
    },Object.keys(teams)[0]);
    const teamsToDisplay = Object.keys(teams).filter(t => t != thisTeam && teams[t].hp > 0);


    useEffect(() => {
  
    }, []);

    function backToStart() {
        setReload((prev) => prev + 1);
    }

    function mapPlonk(lat:number,lng:number) {
        api.post("/game/plonk", {
            id,
            lng: (((lng % 360) + 540) % 360) - 180,
            lat,
        })
    }

    function submitGuess() {
        api.post("/game/guess", {
            id
        })
        setGuessed(true);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.code === "Space") {
            event.preventDefault();
            submitGuess();
          }
          if(event.code === "KeyR"){
            setReload((prev) => prev + 1);
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);

        function rotateTeam() {
            setrightTeamIndex((prev) => (prev + 1) % Math.max(teamsToDisplay.length, 1));
        }
        const intervalId = setInterval(rotateTeam, 5000);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
          clearInterval(intervalId);
        };
      }, []);

    return (
    <div color="bg-dark">
        <DuelsUIOverlay 
          time={endTime} 
          timeLimit={timeLimit} 
          timeOffset={timeOffset} 
          roundNumber={roundInfo.round} 
          multi={multi} 
          maxHealth={maxHealth} 
          teams={teams} 
          users={users} 
          thisUser={thisUser} 
          leftTeam={thisTeam} 
          rightTeam={teamsToDisplay[rightTeamIndex]}
        />
        <div className="streetview-map-container">
            <CombinedMap
                correctLat={roundInfo.lat}
                correctLng={roundInfo.lng}
                reload={reload}
                NMPZ={roundInfo.NMPZ}
                map={spectator ? null: <TeamGuessingMap users={users} plonks={teamPlonks} guesses={teamGuesses} mapBounds={roundInfo.map_bounds} onClick={mapPlonk}/>}
            />
        </div>
        <div className="game-footer">
        <div className="footer-grid">
          <div className="footer-grid-left-elements">
            {!roundInfo.NMPZ &&
              <button className="back-to-start-button dark-hover-button" onClick={backToStart}>
                Back To Start
              </button>
            }
          </div>
          <div className="footer-grid-center-elements"></div>
          <div className="footer-grid-right-elements">
            {guessed ?
                <div className="border border-gray-300 bg-white shadow-md rounded-full text-base font-semibold text-gray-800 mr-4 flex justify-center items-center px-5 py-1.5">
                    {guesses}/{maxGuesses} guesses
                </div>
                :
                <button
                    onClick={submitGuess}
                    disabled={!canGuess}
                    className="game-button"
                >
                    <b className="block">Submit</b>
                </button>
            }
          </div>
        </div>
      </div>
    </div>
    );
}