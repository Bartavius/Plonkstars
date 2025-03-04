"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "../../../utils/api";
import NavBar from "@/components/Navbar";

const CombinedMap = dynamic(() => import("@/components/maps/CombinedMap"), {
  ssr: false,
});

interface location {
  lat: number;
  lng: number;
}

export default function MatchPage() {
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [correctLat, setCorrectLat] = useState<number>(0);
  const [correctLng, setCorrectLng] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(-1);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const params = useParams();
  const matchId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect( () => {
    const fetchLocation = async (id: string) => {
      setLoading(true);
      const response = await api.get(`/game/round?id=${id}`)
      const {lat, lng, round} = response.data;
      setRoundNumber(round);
      setCorrectLat(lat);
      setCorrectLng(lng);
      setLoading(false);
    }

    if (matchId) {
      fetchLocation(matchId); //render loading screen later
    }
  }, [matchId]
  )

  const submitGuess = async () => {
    if (lat !== undefined && lng !== undefined && !submitted) {
      setSubmitted(true);
      await api.post("/game/guess", {lat: lat, lng: (lng%360 + 540) % 360 - 180, id: matchId});
      router.push(
        `/game/${matchId}/result?round=${roundNumber}`
      );
    }
  };

  useEffect(() => {
    console.log(matchId);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lat !== undefined && lng !== undefined && event.code === "Space") {
        event.preventDefault();
        submitGuess();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lat, lng]);

  if (loading) {
    return (<div>Loading...</div>)
  }

  return (
    <div>
      <div className="relative">
          <div className="fixed top-0 left-0 w-full z-20">
            <NavBar />
          </div>
          {" "}
          <CombinedMap
            setLat={setLat}
            setLng={setLng}
            lat={correctLat}
            lng={correctLng}
          />{" "}
        </div>
        <div className="game-footer justify-end pr-8">
          <button
            onClick={submitGuess}
            disabled={(lat !== undefined && lng !== undefined && !submitted) ? false : true}
            style={{zIndex: 10000}}
            className="game-button"
          >
            {" "}
            <b>Submit</b>{" "}
          </button>
        </div>
      </div>
  );
}


  // const locations: location[] = [
  //   { lat: 12.3460211, lng: 92.7708896 },
  //   { lat: 14.959757, lng: 101.830178 },
  //   { lat: -25.356141, lng: 131.049524 },
  //   { lat: -11.485286, lng: -40.601977 },
  //   { lat: 42.892982, lng: -80.46533 },
  //   { lat: -0.457913, lng: 37.05243 },
  //   { lat: 1.039672, lng: 121.949726 },
  //   { lat: 41.936227, lng: -6.144174 },
  //   { lat: 78.223728, lng: 15.633955 },
  //   { lat: 13.904834, lng: -4.555679 },
  //   { lat: -3.489353, lng: 36.162594 },
  //   { lat: 0.823337, lng: 24.454135 },
  //   { lat: 29.1037529, lng: -13.4728803 },
  //   { lat: 0.359676, lng: 6.702448 },
  //   { lat: 23.587131, lng: 58.457222 },
  //   { lat: 39.043605, lng: 125.75801 },
  //   { lat: 43.0662479, lng: 131.9122197 },
  //   { lat: 46.7711772, lng: 142.3433649 },
  //   { lat: 6.542121, lng: -58.2291451 },
  //   { lat: -25.0688603, lng: -130.0959588 },
  //   { lat: 81.4123871, lng: -76.8393025 },
  //   { lat: 81.6647089, lng: -76.4930553 },
  //   { lat: -77.7128275, lng: 162.5976575 },
  //   { lat: -62.1503456, lng: -58.9429835 },
  //   { lat: -52.1858144, lng: -58.8390295 },
  //   { lat: 38.716615, lng: -27.3497239 },
  //   { lat: 42.338847, lng: -71.093807 },
  //   { lat: 42.339908, lng: -71.0882075 },
  //   { lat: 32.328695, lng: -90.1821474 },
  //   { lat: 4.9283746, lng: -75.6232877 },
  //   { lat: -34.0911616, lng: 18.5324254 },
  //   { lat: -34.2199301, lng: 18.8347113 },
  //   { lat: -24.5895433, lng: 25.9474501 },
  //   { lat: -19.997675, lng: 23.4166986 },
  //   { lat: 28.1964639, lng: -177.3940806 },
  //   { lat: 37.8893633, lng: 41.1291598 },
  //   { lat: 37.6368667, lng: 25.0442779 },
  //   { lat: 35.3506333, lng: 24.3084846 },
  //   { lat: 39.9511955, lng: 3.1839338 },
  //   { lat: 46.9865257, lng: 3.1530328 },
  //   { lat: 52.1629893, lng: 10.5444657 },
  //   { lat: 51.6497352, lng: 17.8141469 },
  //   { lat: 57.153593, lng: 24.8535052 },
  //   { lat: 62.2393208, lng: 23.7721738 },
  //   { lat: 57.7826978, lng: 14.1691228 },
  //   { lat: 63.4723116, lng: 10.900804 },
  //   { lat: 68.0901948, lng: 21.7019334 },
  //   { lat: 70.9963697, lng: 24.6622668 },
  //   { lat: 69.4250283, lng: 30.8264528 },
  //   { lat: 54.8595128, lng: 21.1060301 },
  //   { lat: 47.5017751, lng: 19.0348446 },
  //   { lat: 45.7543865, lng: 22.9041277 },
  //   { lat: 43.2073264, lng: 23.5515444 },
  //   { lat: 41.5496983, lng: 20.0592464 },
  //   { lat: 39.9139284, lng: 20.0270992 },
  //   { lat: 42.6114027, lng: 19.0288015 },
  //   { lat: 45.1164333, lng: 15.5860029 },
  //   { lat: 42.0483112, lng: 13.9309836 },
  //   { lat: 43.9435158, lng: 12.4448551 },
  //   { lat: 47.4064937, lng: 8.3974203 },
  //   { lat: 43.7315207, lng: 7.41717 },
  //   { lat: 56.541929, lng: -79.2225907 },
  //   { lat: 39.1669836, lng: -86.5759863 },
  //   { lat: 41.1046009, lng: -7.8172473 },
  //   { lat: 33.1568382, lng: 131.6600038 },
  //   { lat: 35.1656159, lng: -82.8389549 },
  //   { lat: 48.3187097, lng: 4.574294 },
  //   { lat: 48.1923831, lng: 3.6724801 },
  //   { lat: 43.1168347, lng: -75.3423353 },
  //   { lat: 39.7427785, lng: -89.0280223 },
  //   { lat: -4.7953223, lng: -38.9943785 },
  //   { lat: 25.5586498, lng: 79.6085616 },
  //   { lat: 49.3801173, lng: 32.042061 },
  //   { lat: 13.8318029, lng: 101.7107551 },
  //   { lat: -36.3089366, lng: 146.6520263 },
  //   { lat: -12.1056835, lng: -76.8544031 },
  //   { lat: 24.4276404, lng: 118.3131523 },
  //   { lat: 46.4983225, lng: 19.5416744 },
  //   { lat: 44.5441749, lng: -75.3629807 },
  //   { lat: 52.6047788, lng: -1.6589305 },
  //   { lat: 42.9524624, lng: -71.5342457 },
  //   { lat: 44.2983995, lng: -69.1146177 },
  //   { lat: 45.9212799, lng: -119.2896035 },
  //   { lat: 45.8813288, lng: 12.4747719 },
  //   { lat: 59.1478643, lng: 11.3246936 },
  //   { lat: 51.4274578, lng: -0.3125176 },
  //   { lat: 49.9155306, lng: 18.3052192 },
  //   { lat: 42.562083, lng: 0.5691719 },
  //   { lat: 33.7875098, lng: -118.0702205 },
  //   { lat: -9.4286195, lng: -38.2286802 },
  //   { lat: 62.0557927, lng: 22.0590692 },
  //   { lat: 62.917875, lng: 27.67257 },
  //   { lat: -27.1505279, lng: 26.3913037 },
  //   { lat: 42.2905365, lng: -83.6786424 },
  //   { lat: 56.4692132, lng: 16.3951233 },
  //   { lat: -32.9280244, lng: 151.6824633 },
  //   { lat: 25.5310237, lng: 56.3359142 },
  //   { lat: 52.856758, lng: 19.6664674 },
  //   { lat: 34.2688786, lng: -118.5175395 },
  //   { lat: 27.8671645, lng: -82.0785508 },
  //   { lat: 29.0106008, lng: -81.9934159 },
  //   { lat: 54.0812635, lng: 11.9780604 },
  //   { lat: 34.8371873, lng: -82.2857653 },
  //   { lat: 26.5919006, lng: 94.1223263 },
  //   { lat: 33.5124711, lng: 133.9502381 },
  //   { lat: 22.9558091, lng: 76.0478515 },
  //   { lat: 44.2418909, lng: 28.2474979 },
  //   { lat: 45.013871, lng: 15.0334374 },
  //   { lat: 49.0200952, lng: 104.0436772 },
  //   { lat: 34.1184599, lng: -117.6154404 },
  //   { lat: 8.2971371, lng: 3.6483709 },
  //   { lat: 50.1148318, lng: 14.9737575 },
  //   { lat: 47.0358011, lng: 4.5247017 },
  //   { lat: 56.5446276, lng: 13.0563469 },
  //   { lat: 46.4029099, lng: 26.7141419 },
  //   { lat: 42.4134517, lng: 13.8433778 },
  //   { lat: -6.1721852, lng: 107.1709696 },
  //   { lat: 29.7171719, lng: 77.4691547 },
  //   { lat: 39.2338533, lng: -0.4461509 },
  //   { lat: 20.2991598, lng: 73.1545604 },
  //   { lat: 26.83237, lng: 73.7817024 },
  //   { lat: 12.3143912, lng: 75.8748285 },
  //   { lat: -9.2096645, lng: -76.1490285 },
  //   { lat: 40.0936501, lng: -80.1869273 },
  //   { lat: 19.152831, lng: 72.849296 },
  //   { lat: 31.1345342, lng: -83.7118899 },
  //   { lat: 30.5201998, lng: -86.1302405 },
  //   { lat: 25.611574, lng: 73.921594 },
  //   { lat: 53.1170731, lng: 9.123263 },
  //   { lat: 56.4876314, lng: 26.0377017 },
  //   { lat: -3.2326548, lng: -44.3505577 },
  //   { lat: 38.9772354, lng: -5.3062544 },
  //   { lat: 37.5873296, lng: -1.7407142 },
  //   { lat: 47.6305238, lng: 43.1380488 },
  //   { lat: 32.0504265, lng: 75.3777084 },
  //   { lat: 50.0980566, lng: 21.9495297 },
  //   { lat: -26.4020894, lng: -51.1736427 },
  //   { lat: 44.3127374, lng: 15.4231316 },
  //   { lat: 63.2559241, lng: 17.5617582 },
  //   { lat: 49.0924183, lng: 15.2170741 },
  //   { lat: 19.257648, lng: -97.2703156 },
  //   { lat: -32.1979503, lng: 149.6283189 },
  //   { lat: 41.6941782, lng: -79.2551045 },
  //   { lat: 35.3370679, lng: 25.1530426 },
  //   { lat: 39.098747, lng: -91.1628193 },
  //   { lat: -8.3499037, lng: 120.7581137 },
  //   { lat: 32.7857543, lng: -103.5053186 },
  //   { lat: 36.7862908, lng: 53.1087452 },
  //   { lat: 51.6145967, lng: 7.9730278 },
  //   { lat: 19.3705393, lng: -100.1480674 },
  //   { lat: 55.5628145, lng: 8.7805642 },
  //   { lat: 33.65453, lng: -117.3790684 },
  // ];

  // const randomLocation =
  //   locations[Math.floor(Math.random() * locations.length)];