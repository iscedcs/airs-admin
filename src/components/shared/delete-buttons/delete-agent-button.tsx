'use client';
import { useToast } from '@/components/ui/use-toast';
import { LoaderIcon, Trash } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function DeleteAgentButton({ id }: { id: string }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const handleDelete = async (id: string) => {
		setIsLoading(true);
		try {
			const createAgentResponse = await fetch('/api/create-agent', {
				method: 'DELETE',
				body: JSON.stringify({
					id: id,
				}),
			});
			const result = await createAgentResponse.json();
			if (result.status) {
				toast({
					title: 'Deleted Successfully',
				});
				setIsLoading(false);
				console.log({ result });
				revalidatePath('/agents', 'layout');
				router.push(`/agents`);
			} else {
				setIsLoading(false);
				toast({
					title: result.message,
				});
				throw new Error(`Something Went wrong ${result.error}`);
			}
		} catch (error) {
			setIsLoading(false);
		}
	};
	return (
		<div
			className='items-center cursor-pointer'
			onClick={() => handleDelete(id)}
		>
			{isLoading ? (
				<LoaderIcon className='h-4 w-4 animate-spin' />
			) : (
				<Trash className='h-4 w-4' />
			)}
		</div>
	);
}
