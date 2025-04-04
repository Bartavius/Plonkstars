"use client";

import React from 'react';
import Login from './Login';

export default function LoginPage() {
  	return (
    	<div className="flex flex-col min-h-screen">
      		<div className="fixed top-0 left-0 w-full">
            	<Login />
			</div>
		</div>
  	);
};