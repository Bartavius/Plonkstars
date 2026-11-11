"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import NavBar from "@/components/primitives/navbar";
import { persistor } from "@/store/store";
import { store } from "@/store/store";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="fixed top-0 left-0 w-full z-20">
          <NavBar />
        </div>
        {children}
      </PersistGate>
    </Provider>
  );
}
