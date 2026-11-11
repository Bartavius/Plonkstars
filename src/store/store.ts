import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";

import { demoAvatarReducer } from "./demo-avatar-slice";
import { errorReducer } from "./error-slice";
import { gameReducer } from "./game-slice";
import { partyReducer } from "./party-slice";
import { settingsReducer } from "./settings-slice";

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

const rootReducer = combineReducers({
  game: persistReducer(gamePersistConfig, gameReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  demoAvatar: persistReducer(demoAvatarPersistConfig, demoAvatarReducer),
  party: persistReducer(partyPersistConfig, partyReducer),
  error: errorReducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
