'use client';
import { deleteIcon, loadingSpinner } from '@/lib/icons';
import React from 'react';
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function DeleteSettingsButton({ id }: { id: string }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const handleDelete = async (id: string) => {
		setIsLoading(true);
		try {
			const deleteSettingsResponse = await fetch(
				'/api/create-settings',
				{
					method: 'DELETE',
					body: JSON.stringify({
						setting_id: id,
					}),
				}
			);
			const result = await deleteSettingsResponse.json();
			if (
				deleteSettingsResponse.status > 199 &&
				deleteSettingsResponse.status < 299
			) {
				toast({
					title: 'Deleted Successfully',
				});
				setIsLoading(false);
				router.refresh();
				return NextResponse.json(result);
			} else {
				setIsLoading(false);
				toast({
					title: 'Not Updated',
					description: 'Something went wrong',
				});
				throw new Error(
					`Something Went wrong ${result.statusText}`
				);
			}
		} catch (error) {
			setIsLoading(false);
		}
	};
	return (
		<Button
			className='items-center cursor-pointer w-32 h-12 flex justify-center'
			onClick={() => handleDelete(id)}
		>
			<span className='h-4 w-4 flex items-center justify-center'>
				{isLoading ? loadingSpinner : deleteIcon}
			</span>
		</Button>
	);
}
