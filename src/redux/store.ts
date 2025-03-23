import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import gameReducer from './gameSlice';
import settingsReducer from './settingsSlice';
import errorReducer from './errorSlice';
import sessionStorage from 'redux-persist/lib/storage/session';

const gamePersistConfig = {
  key: 'game',
  storage: sessionStorage,
};

const settingsPersistConfig = {
  key: 'settings',
  storage: storage,
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: persistReducer<any>(gamePersistConfig, gameReducer),
    settings: persistReducer<any>(settingsPersistConfig, settingsReducer),
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