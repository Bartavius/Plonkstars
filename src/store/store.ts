import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";

import demoAvatarReducer from "./demo-avatar-slice";
import errorReducer from "./error-slice";
import gameReducer from "./game-slice";
import PartyReducer from "./party-slice";
import settingsReducer from "./settings-slice";

const gamePersistConfig = {
  key: "game",
  storage: sessionStorage,
};

const settingsPersistConfig = {
  key: "settings",
  storage: storage,
};

const demoAvatarPersistConfig = {
  key: "demoAvatar",
  storage: storage,
};

const partyPersistConfig = {
  key: "party",
  storage: sessionStorage,
};

export const store = configureStore({
  reducer: {
    game: persistReducer<any>(gamePersistConfig, gameReducer),
    settings: persistReducer<any>(settingsPersistConfig, settingsReducer),
    demoAvatar: persistReducer<any>(demoAvatarPersistConfig, demoAvatarReducer),
    party: persistReducer<any>(partyPersistConfig, PartyReducer),
    error: errorReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
