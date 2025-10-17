import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function SummaryCard({
	href,
	title,
	description,
	value,
}: {
	href: string;
	title: string;
	description: string;
	value: number;
}) {
	return (
		<Link href={href}>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className='grid grid-cols-1 px-2 py-4'>
					<div className='pointer-events-none relative grid gap-2 rounded-md border border-primary bg-secondary p-2'>
						<p className='font-bold leading-none'>Total</p>
						<p className='text-2xl text-muted-foreground'>
							{value}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
