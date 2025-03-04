import NavBar from "../Navbar";
import "./Streetview.css";

export default function StreetView({ lat, lng }: { lat: number; lng: number }) {
  const API_KEY = process.env.NEXT_PUBLIC_STREET_VIEW_API;
  return (
    <div className="street-view-container bg-gray-200">
      <div className="street-view-box bg-black-200">
        <div className="street-view-embed bg-red-200">
          <iframe
            width="100"
            height="100"
            style={{border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}
      &location=${lat},${lng}
      `}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
