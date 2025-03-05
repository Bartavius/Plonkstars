"use client";

import React from 'react';
import Register from './Register';
import NavBar from '@/components/Navbar';

export default function RegisterPage() {
  	return (
    	<div className="flex flex-col min-h-screen">
      		<div className="fixed top-0 left-0 w-full z-20">
            	<Register />
			</div>
		</div>
  	);
};