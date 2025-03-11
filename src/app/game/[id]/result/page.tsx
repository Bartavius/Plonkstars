"use client";

import ProtectedRoutes from "@/app/ProtectedRoutes";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Results = dynamic(() => import("./ResultsPage"), { ssr: false });

export default function GameResultPage() {
  return (
    <ProtectedRoutes>
      <Suspense fallback={<Loading />}>
        <Results />
      </Suspense>
    </ProtectedRoutes>
  );
}
