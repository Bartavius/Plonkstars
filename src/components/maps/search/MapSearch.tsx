"use client";

import api from "@/utils/api";
import { useEffect, useState } from "react";
import MapCard from "./MapCard";
import "./MapSearch.css"
import Loading from "@/components/loading";

export default function MapSearch({
    mapSelect,
    pageSize,
    bodySize,
    editable = false
}:{
    mapSelect: (id:string,name:string) => void,
    pageSize?:number,
    bodySize?:string,
    editable?:boolean
}){
    const [loading, setLoading] = useState<boolean>();
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("");
    const [mapName, setMapName] = useState("");
    const [hasNext, setHasNext] = useState(false);
    const [maps, setMaps] = useState([]);

    if (!pageSize) {
        pageSize = 24;
    }

    const query = async () => {
        if (!loading) {
            setLoading(true);
            const res = await api.get(`/map/search?name=${mapName}&page=${page}&per_page=${pageSize}${editable? "&editable=true":""}`);
            setMaps(res.data.maps);
            setHasNext(res.data.pages > page);
            setLoading(false);
        }
    }

    useEffect(() => {
        query();
    },[page,mapName]);
    
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
                        disabled={loading}
                        className={`btn px-2 rounded-r-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                            if (loading) return;
                            setPage(1);
                            setMapName(input);
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>
            {loading && <div className="center-loading" style={ bodySize?{}:{height: "50vh"}}><Loading/></div>}
            <div className={`search-body ${bodySize? "search-body-height":""}`} style={{height: bodySize? bodySize: "100%"}}>
                {!loading && maps.length === 0 && page === 1 && (<div className="mx-10">No results found.</div>)}
                {!loading && (
                    <div className="mx-10">
                        <ul className="results-grid">
                            {maps.map((map: any, index) => (
                                <li
                                    key={index}
                                >
                                    <MapCard map={map} onClick={() => mapSelect(map.id, map.name)}/>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between">
                            {page != 1? <button onClick={() => setPage(page - 1)} className="btn next-button">Prev Page</button>: <div></div>}
                            {hasNext? <button onClick={() => setPage(page + 1)} className="btn next-button">Next Page</button>: <div></div>}
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    )
}
