"use client";

import React from 'react';
import Register from './_components/register';

export default function RegisterPage() {
  	return (
    	<div className="flex flex-col min-h-screen">
      		<div className="fixed top-0 left-0 w-full">
            	<Register />
			</div>
		</div>
  	);
};