"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoginTooltipWrapper } from "@/features/auth/components/login-tooltip-wrapper";
import { ProtectedRoutes } from "@/features/auth/components/protected-routes";
import { isDemo } from "@/features/auth/services/session";
import { MapSearch } from "@/features/maps/components/map-search";
import { api } from "@/services/api";

export default function MapMainPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const demo = isDemo();
  const router = useRouter();
  const mapSelect = (id: string) => {
    if (loading) {
      return;
    }
    router.push(`/map/${id}`);
  };

  const cleanName = (text: string): string => text.replace(/[^\S ]+/g, "");
  const createMap = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const newName = cleanName(name);
    if (newName.length > 0) {
      const res = await api.post(`/map/edit/create`, { name: newName });
      router.push(`/map/${res.data.id}`);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoutes allowDemo={true}>
      <div className="navbar-buffer" />
      <LoginTooltipWrapper demo={demo} position="bottom" message="Login to create a map">
        <h2 className="text-center text-white text-4xl">Create a Map</h2>
        <div className="search-bar-wrapper p-4">
          <div className="flex">
            <input
              id="map-create-bar"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-1 text-dark"
              type="text"
              placeholder="Insert a map name..."
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
            />
            <button disabled={loading} className="btn px-2 rounded-r-md" onClick={createMap}>
              Create
            </button>
          </div>
        </div>
      </LoginTooltipWrapper>
      <div className="text-center text-white text-4xl">Map Search</div>
      <MapSearch mapSelect={mapSelect} />
    </ProtectedRoutes>
  );
}
