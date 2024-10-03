'use client';
import { NewWaiverForm } from '@/components/forms/new-waiver-form';
import { UpdateWaiverForm } from '@/components/forms/update-waiver-form';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { PlusIcon, UploadCloudIcon } from 'lucide-react';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';

export default function UpdateWaiverButton({ waiver }: { waiver: IWaiver }) {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (isDesktop)
		return (
			<Dialog>
				<DialogTrigger asChild>
					<Button
						className='justify-start rounded-xl'
						variant={'default'}
					>
						<UploadCloudIcon className='mr-1 h-4 w-4 shrink-0' />
						Update Waiver
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogTitle>Request Update Waiver</DialogTitle>
					<UpdateWaiverForm waiver={waiver} />
				</DialogContent>
			</Dialog>
		);
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					className='justify-start rounded-xl'
					variant={'default'}
				>
					<UploadCloudIcon className='mr-1 h-4 w-4 shrink-0' />
					Update Waiver
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='gap-5'>
					<DrawerTitle>Request Update Waiver</DrawerTitle>
					<UpdateWaiverForm waiver={waiver} />
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	);
}
