import { cn } from '@/lib/utils';
import React from 'react';

export default function MaxWidthWrapper({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn('w-full max-w-6xl mx-auto', className)}>
			{children}
		</div>
	);
}
