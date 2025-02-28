import NavBar from "../Navbar";
import "./Streetview.css";

export default function StreetView({ lat, lng }: { lat: number; lng: number }) {
  const API_KEY = process.env.NEXT_PUBLIC_STREET_VIEW_API;
  return (
    <div className="street-view-container">
      <div className="street-view-box">
        <div className="street-view-embed">
          <div
            className="absolute top-0 left-0  w-full"
            style={{ zIndex: 10000, height: 67 }}
          ><NavBar /></div>
          <iframe
            width="600"
            height="450"
            className="top-0 left-0 absolute"
            style={{ border: 0}}
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
