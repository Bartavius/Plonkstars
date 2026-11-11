import "./streetview.css";
interface StreetViewProps {
  lat: number;
  lng: number;
}

function StreetView({ lat, lng }: StreetViewProps) {
  const API_KEY = process.env.NEXT_PUBLIC_STREET_VIEW_API;
  return (
    <div className="street-view-box">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
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

export { StreetView };
