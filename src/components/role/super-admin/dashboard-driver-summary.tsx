'use client';
import { buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export function DashboardDriverSummary({
	className,
	info,
}: {
	className?: string;
	info: IOthers;
}) {
	const statusArray: StatusItem[] = Object.keys(info).map((title) => ({
		title,
		// @ts-ignore
		description: info[title],
	}));
	let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	return (
		<Card
			className={cn(
				'w-full bg-secondary flex flex-col justify-between',
				className
			)}
		>
			<div className=''>
				<CardHeader>
					<CardTitle>Drivers</CardTitle>
					<CardDescription>
						Summary of driver details
					</CardDescription>
				</CardHeader>
				<CardContent className='grid grid-cols-3 p-2'>
					{statusArray.map((info, index) => (
						<div
							key={index}
							className='relative p-2 h-full w-full'
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<AnimatePresence>
								{hoveredIndex === index && (
									<motion.span
										className='absolute inset-0 h-full w-full bg-primary dark:bg-slate-800/[0.8] rounded '
										layoutId='hoverBackground'
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: {
												duration: 0.15,
											},
										}}
										exit={{
											opacity: 0,
											transition: {
												duration: 0.15,
												delay: 0.2,
											},
										}}
									/>
								)}
							</AnimatePresence>
							<div className='grid place-items-center gap-2 rounded-md border border-primary p-2 pointer-events-none relative bg-secondary'>
								<p className='font-bold leading-none'>
									{info.title}
								</p>
								<p className='text-2xl text-muted-foreground'>
									{info.description}
								</p>
							</div>
						</div>
					))}
				</CardContent>
			</div>
			<CardFooter>
				<Link
					href='/drivers?page=1&limit=15'
					className={cn(buttonVariants(), 'w-full')}
				>
					{' '}
					View all drivers
				</Link>
			</CardFooter>
		</Card>
	);
}
