'use client';

import { useParams } from 'next/navigation';

export default function MatchPage() {
  const params = useParams(); // Get dynamic route parameters
  const matchId = params.id; // Access the match ID

  return (
    <div>
      <h1>Match ID: {matchId}</h1>
      <p>This is the match page for match ID {matchId}</p>
    </div>
  );
}