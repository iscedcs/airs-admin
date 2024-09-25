'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();
	return (
		<div className='grid place-items-center w-full'>
			<div className='flex flex-col items-center justify-center text-center'>
				<h2>Vehicle Not Found</h2>
				<p>Could not find requested resource</p>
				<Button
					onClick={() => router.back()}
					variant='link'
				>
					Go Back
				</Button>
				<Button
					asChild
					variant='link'
				>
					<Link href='/dashboard'>Go to Dashboard</Link>
				</Button>
			</div>
		</div>
	);
}
