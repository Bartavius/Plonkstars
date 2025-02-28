"use client";

import React from 'react';
import Login from './Login';
import { Provider } from 'react-redux';
import {store} from '../../redux/store';
import NavBar from '@/components/Navbar';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-20">
        <NavBar />
          <Provider store={store}>
            <Login />
          </Provider>
      </div>
    </div>
  );
};

export default App;