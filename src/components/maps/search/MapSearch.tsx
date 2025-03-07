"use client";

import api from "@/utils/api";
import { use, useEffect, useState } from "react";
import "./MapSearch.css"

const MapSearch = ({mapSelect,pageSize}:{mapSelect: (id:string,name:string) => void,pageSize:number}) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("");
    const [mapName, setMapName] = useState("");
    const [hasNext, setHasNext] = useState(false);
    const [maps, setMaps] = useState([]);

    const query = async () => {
        if (!loading) {
            setLoading(true);
            const res = await api.get(`/map/search?name=${mapName}&page=${page}&per_page=${pageSize}`);
            console.log(res.data);
            setMaps(res.data.maps);
            setHasNext(res.data.pages > page);
            setLoading(false);
        }
    }

    useEffect(() => {
        query();
    },[page,mapName]);

    useEffect(() => {
        query();
    },[]);
    
    return (
        <div className="relative">
            <div className="search-bar-wrapper p-4">
                <div className="flex">
                    <input
                        id="map-search-bar"
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-1 text-dark"
                        type="text"
                        placeholder="Search for a map..." 
                        onChange={(e) =>{
                                setInput(e.target.value)
                            }
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setPage(1); 
                              setMapName(input);
                              e.currentTarget.blur();
                            }
                        }}
                    />
                    <button
                        className="btn px-2 rounded-r-md"
                        onClick={() => {
                            setPage(1);
                            setMapName(input);
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="search-body">
                {loading && <div className="mx-10">Loading results...</div>}
                {!loading && maps.length === 0 && page === 1 && (<div className="mx-10">No results found.</div>)}
                {!loading && (
                    <div className="mx-10">
                        <ul className="results-grid">
                            {maps.map((map: any, index) => (
                                <li
                                    key={index}
                                    onClick={() => mapSelect(map.id, map.name)}
                                >
                                    <div className="mt-2 cursor-pointer hover:bg-gray-100 text-dark flex items-center bg-white rounded-lg shadow-lg">
                                        <img src="/PlonkStarsMarker.png" className="h-full p-4"/>
                                        <div className="inline">
                                            <div className="text-lg">
                                                {map.name}
                                            </div>
                                            <div className="text-sm">
                                                {map.creator.username}                             
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between">
                            {page != 1? <button onClick={() => setPage(page - 1)} className="btn next">Prev Page</button>: <div></div>}
                            {hasNext? <button onClick={() => setPage(page + 1)} className="btn next">Next Page</button>: <div></div>}
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    )
}
export default MapSearch;