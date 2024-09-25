// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Marker } from '@vis.gl/react-google-maps';
// import { generateRandomLocation } from '@/lib/utils';

// export const LOCATION_MAPS = generateRandomLocation();

// export const MovingMarker = () => {
// 	const [position, setPosition] =
// 		useState<google.maps.LatLngLiteral>(LOCATION_MAPS);

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			const speed = 0.0001;
// 			const randomDirection = Math.random() * 360;
// 			const t = performance.now();
// 			const lat = position.lat + speed * Math.cos(randomDirection);
// 			const lng = position.lng + speed * Math.sin(randomDirection);

// 			setPosition({ lat, lng });
// 		}, 500);

// 		return () => clearInterval(interval);
// 	});

// 	return <Marker position={position}></Marker>;
// };
