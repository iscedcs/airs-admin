'use client';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavbarButton = ({
	href,
	icon,
	title,
}: {
	href: string;
	icon: React.ReactNode;
	title: string;
}) => {
	const pathname = usePathname();
	return (
		<Button
			className='justify-start rounded-xl'
			asChild
			variant={pathname.startsWith(href) ? 'default' : 'ghost'}
		>
			<Link
				href={href}
				className='shrink-0 whitespace-nowrap'
			>
				<div className='mr-2 h-4 w-4 shrink-0'>{icon}</div>
				{title}
			</Link>
		</Button>
	);
};
