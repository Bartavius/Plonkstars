"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Results = dynamic(() => import("./ResultsPage"), { ssr: false });

export default function GameResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  )
}
