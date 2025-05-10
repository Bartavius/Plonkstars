import Table from "@/components/table/table";
import "./results.css";
import { Location } from "@/types/location";
import api from "@/utils/api";

export default function MapAccordian({
  open,
  className = "",
  maps,
  location,
  setMessage,
}: {
  open: boolean;
  className?: string;
  maps: any[];
  location: Location;
  setMessage: (message: React.ReactNode) => void;
}) {
  const headers = { Name: "Map Name" };

  const addToMap = async (mapId: string) => {
    if (location === undefined) return;
    try {
      const res = await api.post("/map/edit/bound/add", {
        ...location,
        id: mapId,
        weight: 1,
      });
      setMessage("Successfully added the location!");
    } catch (error) {
      setMessage("Failed to add the location.");
    }
  };

  const data = maps.map((map) => {
    return {
      Name: (
        <div className="round-rank-box flex !justify-between items-center !flex-row px-3">
          <span className="text-2xl inline">{map.name}</span>
          <button
            className="btn-primary text-white text-lg inline-block"
            onClick={() => addToMap(map.uuid)}
          >
            + Add
          </button>
        </div>
      ),
    };
  });

  return (
    <div className={`${className} map-accordion`}>
      {open && (
        <div className="accordion-content">
          <Table
            data={data}
            headers={headers}
            rowHeader="heading"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
