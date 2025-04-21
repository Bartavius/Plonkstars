import "./Streetview.css";

export default function StreetView({ lat, lng }: { lat: number; lng: number }) {
  const API_KEY = process.env.NEXT_PUBLIC_STREET_VIEW_API;
  return (
    <div className="street-view-box">
      <iframe
        width="100%"
        height="100%"
        style={{border: 0 }}
        className="street-view-iframe"
        referrerPolicy="no-referrer-when-downgrade"
        allow="accelerometer; gyroscope"
        src={`https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&fov=100
  &location=${lat},${lng}
  `}
      />
    </div>
  );
}
