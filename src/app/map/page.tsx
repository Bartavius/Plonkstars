"use client";

import api from "@/utils/api";
import { use, useEffect, useState } from "react";
import "./page.css"

const PAGESIZE = 24;
const MapPage = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [mapName, setMapName] = useState("");
    const [maps, setMaps] = useState([]);

    const query = async () => {
        if (!loading) {
            setLoading(true);
            const res = await api.get(`/map/search?name=${mapName}&page=${page}&per_page=${PAGESIZE}`);
            console.log(res.data);
            setMaps(res.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        query();
    },[page]);
    
    return (
        <div className="relative">
            <div className='nav-bar-buffer'></div>
            <div className="search-bar-wrapper p-4">
                <div className="flex">
                    <input
                        id="map-search-bar"
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-1 text-dark"
                        type="text"
                        placeholder="Search for a map..." 
                        onChange={(e) =>
                        setMapName(e.target.value)
                        }
                    />
                    <button
                        className="btn px-2 rounded-r-md"
                        onClick={query}
                    >
                        Search
                    </button>
                </div>
                <div>or <a href="/not-implemented" className="link">click here</a> to create one</div>
            </div>
            
            {loading && <div className="mx-10">Loading results...</div>}
            {!loading && (
                <div className="mx-10">
                    <div className="flex justify-between">
                        {page != 1? <button onClick={() => setPage(page - 1)}>Prev Page</button>: <div></div>}
                        {maps.length === PAGESIZE? <button onClick={() => setPage(page + 1)}>Next Page</button>: <div></div>}
                    </div>
                    <ul className="grid">
                        {maps.map((map: any, index) => (
                            <li
                                key={index}
                            >
                                <div className="mx-4 my-2 cursor-pointer hover:bg-gray-100 text-dark flex items-center bg-white rounded-lg shadow-lg">
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
                        {page != 1? <button onClick={() => setPage(page - 1)}>Prev Page</button>: <div></div>}
                        {maps.length === PAGESIZE? <button onClick={() => setPage(page + 1)}>Next Page</button>: <div></div>}
                    </div>
                </div>
                )
            }
        </div>
    )
}
export default MapPage;