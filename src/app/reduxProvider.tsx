
'use client';

import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/redux/store';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import NavBar from '@/components/Navbar';

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
  )
}