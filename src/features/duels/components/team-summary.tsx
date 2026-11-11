import { useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import type { useRouter } from "next/navigation";

import { UserIcon } from "@/features/user/components/user-icon";
import type { DuelsSummaryGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";
import type { DuelsUser } from "@/features/duels/types/duels-user";

import playerTitlesJSON from "./player-titles.json" assert { type: "json" };
import { DuelsTeamRoundSummary } from "./round-display";
import { DuelsTeamBox } from "./team-box";
import "./team-summary.css";

interface PlayerTitle {
  text: string;
  titles: string[];
}

const PLAYER_TITLES: Record<string, PlayerTitle> = playerTitlesJSON;

interface CumulativeStats {
  score: number;
  time: number;
  distance: number;
  totalRank: number;
  teamRank: number;
}

interface DuelsTeamSummaryProps {
  users: Record<string, DuelsUser>;
  thisUser: string;
  teams: Record<string, DuelsTeam>;
  teamHP: { [key: string]: number[] };
  startHP: number;
  teamGuesses: Record<string, DuelsSummaryGuess[][]>;
  locations: { lat: number; lng: number }[];
  router: ReturnType<typeof useRouter>;
  setDisplayRound: (round: number | "all") => void;
}

function DuelsTeamSummary({
  users,
  thisUser,
  teams,
  teamHP,
  startHP,
  teamGuesses,
  locations,
  router,
  setDisplayRound,
}: DuelsTeamSummaryProps) {
  const teamPlacements = Object.keys(teams).sort((a, b) => {
    if (teamHP[b].length != teamHP[a].length) {
      return teamHP[b].length - teamHP[a].length;
    } else {
      let index = teamHP[a].length - 1;
      while (teamHP[a][index] === teamHP[b][index] && index >= 0) {
        index -= 1;
      }
      return teamHP[b][index] - teamHP[a][index];
    }
  });

  const winningTeam = teamPlacements[0];
  const thisTeam = users[thisUser]?.team ?? winningTeam;
  const userIndex = teams[thisTeam].members.indexOf(thisUser);

  const [displayTeam, _setDisplayTeam] = useState<string>(thisTeam);
  const [currentTeamPlayerIdx, _setCurrentTeamPlayerIdx] = useState<number>(Math.max(userIndex, 0));

  function setDisplayTeam(teamId: string) {
    _setDisplayTeam(teamId);
    const userIndex = teams[teamId].members.indexOf(thisUser);

    _setCurrentTeamPlayerIdx(Math.max(userIndex, 0));
    router.push("#team-summary");
  }

  function leftPlayer() {
    _setCurrentTeamPlayerIdx(
      (prev) => (prev - 1 + teams[displayTeam].members.length) % teams[displayTeam].members.length,
    );
  }

  function rightPlayer() {
    _setCurrentTeamPlayerIdx((prev) => (prev + 1) % teams[displayTeam].members.length);
  }

  function getRandomTitle(title: string) {
    const titles = PLAYER_TITLES[title]?.titles;
    return titles[Math.floor(Math.random() * titles.length)];
  }

  const numRounds = locations.length;
  const bestGuesses = Array(numRounds).fill(null);
  const numRoundGuesses = Array(numRounds).fill(0);

  teamPlacements.forEach((teamId) => {
    teamGuesses[teamId].forEach((roundGuesses, roundIndex) => {
      roundGuesses.forEach((guess) => {
        if (bestGuesses[roundIndex] === null || guess.rank == 1) {
          bestGuesses[roundIndex] = guess;
        }
      });
      numRoundGuesses[roundIndex] += roundGuesses.length;
    });
  });

  const playerValue: { [key: string]: number } = {};
  const numPlayersInTeam = teams[displayTeam].members.length;
  teamGuesses[displayTeam].forEach((roundGuesses, round) => {
    roundGuesses.forEach((guess, index) => {
      if (!(guess.user in playerValue)) {
        playerValue[guess.user] = 0;
      }
      if (index == 0) {
        if (bestGuesses[round].user == guess.user) {
          playerValue[guess.user] += 4 * numPlayersInTeam;
        } else {
          playerValue[guess.user] += 2 * numPlayersInTeam;
        }
      }
      playerValue[guess.user] += numPlayersInTeam - index;
    });
  });

  const playerTitles: Record<string, string> = {};

  teams[displayTeam].members.forEach((member: string) => {
    playerTitles[member] = "average";
  });

  if (teams[displayTeam].members.length == 1) {
    playerTitles[teams[displayTeam].members[0]] = "lonely";
  } else {
    const playersSorted = Object.keys(playerValue).sort((a, b) => playerValue[a] - playerValue[b]);
    playerTitles[playersSorted[0]] = "useless";
    playerTitles[playersSorted[playersSorted.length - 1]] = "mvp";
  }

  const roundsWon = teamPlacements.reduce<Record<string, number[]>>((acc, teamId) => {
    acc[teamId] = teamHP[teamId].reduce<[number, number[]]>(
      (acc, hp, idx) => {
        if (hp == acc[0]) {
          acc[1].push(idx);
        }
        return [hp, acc[1]];
      },
      [startHP, []],
    )[1];
    return acc;
  }, {});

  const displayTeamInfo = teams[displayTeam];
  const displayTeamGuesses = teamGuesses[displayTeam];
  const displayTeamHP = teamHP[displayTeam];

  const currentTeamPlayer = displayTeamInfo.members[currentTeamPlayerIdx];
  const currentPlayerCumStats = displayTeamGuesses.reduce<CumulativeStats>(
    (acc, roundGuesses, roundNumber) => {
      const index = roundGuesses.findIndex((g) => g.user === currentTeamPlayer);
      const playerGuess = index !== -1 ? roundGuesses[index] : undefined;

      if (playerGuess) {
        return {
          totalRank: acc.totalRank + playerGuess.rank + 1,
          teamRank: acc.teamRank + index + 1,
          score: acc.score + playerGuess.score,
          time: acc.time + playerGuess.time,
          distance: acc.distance + playerGuess.distance,
        };
      }
      return {
        ...acc,
        teamRank: acc.teamRank + roundGuesses.length + 1,
        totalRank: acc.totalRank + numRoundGuesses[roundNumber] + 1,
      };
    },
    { score: 0, time: 0, distance: 0, totalRank: 0, teamRank: 0 },
  );

  const numRoundsPlayed = displayTeamGuesses.length;
  const currentPlayerAvgStats = {
    score: currentPlayerCumStats.score / numRoundsPlayed,
    time: currentPlayerCumStats.time / numRoundsPlayed,
    distance: currentPlayerCumStats.distance / numRoundsPlayed,
    teamRank: currentPlayerCumStats.teamRank / numRoundsPlayed,
    totalRank: currentPlayerCumStats.totalRank / numRoundsPlayed,
  };

  return (
    <div>
      <div className="duels-team-container">
        {teamPlacements.map((teamId, placement) => (
          <DuelsTeamBox
            key={placement}
            placement={placement + 1}
            teamInfo={teams[teamId]}
            teamHP={teamHP[teamId]}
            teamGuesses={teamGuesses[teamId]}
            roundsWon={roundsWon[teamId]}
            onClick={() => setDisplayTeam(teamId)}
          />
        ))}
      </div>
      <div className="duels-team-summary-container" id="team-summary">
        <div className="duels-team-summary-title">{displayTeamInfo.name} Summary</div>
        <div className="duels-team-summary-overall-stats">
          <div className="duels-team-summary-title-container">
            <div className="duels-team-summary-title-title">
              {PLAYER_TITLES[playerTitles[currentTeamPlayer]].text}
            </div>
            <div className="duels-team-summary-title-subtext">
              {getRandomTitle(playerTitles[currentTeamPlayer])}
            </div>
          </div>
          <div className="duels-team-summary-player">
            <div className="duels-team-summary-player-title duels-team-summary-small-screen-hidden">
              Team Player{teams[displayTeam].members.length > 1 && "s"}
            </div>
            <div className="duels-team-summary-player-players-container">
              {teams[displayTeam].members.length > 1 && (
                <BiSolidLeftArrow onClick={leftPlayer} className="dark-hover-button" />
              )}
              <div className="duels-team-summary-players-user-icon">
                <UserIcon data={users[currentTeamPlayer]} />
              </div>
              {teams[displayTeam].members.length > 1 && (
                <BiSolidRightArrow onClick={rightPlayer} className="dark-hover-button" />
              )}
            </div>
            <div className="duels-team-summary-players-username">{currentTeamPlayer}</div>
          </div>
          <div className="duels-team-summary-player-stats">
            <div className="duels-team-summary-player-stats-title">Player Stats</div>
            <div className="duels-team-summary-player-stats-container">
              <div className="duels-team-summary-player-stat">
                <div className="duels-team-summary-player-stat-key">Average Score</div>
                <div className="duels-team-summary-player-stat-value">
                  {currentPlayerAvgStats.score.toFixed(2)}
                </div>
              </div>
              <div className="duels-team-summary-player-stat">
                <div className="duels-team-summary-player-stat-key">Average Time</div>
                <div className="duels-team-summary-player-stat-value">
                  {currentPlayerAvgStats.time.toFixed(2)}
                </div>
              </div>
              <div className="duels-team-summary-player-stat">
                <div className="duels-team-summary-player-stat-key">Average Team Rank</div>
                <div className="duels-team-summary-player-stat-value">
                  {currentPlayerAvgStats.teamRank.toFixed(2)}
                </div>
              </div>
              <div className="duels-team-summary-player-stat">
                <div className="duels-team-summary-player-stat-key">Average Global Rank</div>
                <div className="duels-team-summary-player-stat-value">
                  {currentPlayerAvgStats.totalRank.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="duels-team-summary-rounds">
          {displayTeamGuesses.map((guesses, round) => (
            <DuelsTeamRoundSummary
              key={round}
              roundNumber={round + 1}
              teamInfo={displayTeamInfo}
              prevHp={round == 0 ? startHP : displayTeamHP[round - 1]}
              hp={displayTeamHP[round]}
              maxHealth={startHP}
              bestGuess={bestGuesses[round]}
              bestTeamGuess={guesses[0]}
              users={users}
              teams={teams}
              onClick={() => setDisplayRound(round)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { DuelsTeamSummary };
