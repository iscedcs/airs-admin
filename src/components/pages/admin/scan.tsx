'use client';
import React, { useEffect, useState, useRef } from 'react';
import QrScanner from 'qr-scanner';
import QRCode from 'qrcode.react';
import { Card } from '@/components/ui/card';
import { copyIcon, successIcon } from '@/lib/icons';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import localforage from 'localforage';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function QRScan({ role }: { role?: string }) {
	const { toast } = useToast();
	const [result, setResult] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [scanning, setScanning] = useState(false);
	const [scanCount, setScanCount] = useState(0);
	const scannerRef = useRef<QrScanner | null>(null);
	const router = useRouter();

	const [scannedHistory, setScannedHistory] = useState<string[]>([]);

	useEffect(() => {
		localforage.getItem('scannedHistory').then((history) => {
			if (history) {
				setScannedHistory(history as string[]);
			}
		});
	}, []);

	const startScan = () => {
		setResult(null);
		setOpen(false);
		setScanning(true);
		setScanCount(0);
		scannerRef.current?.start();
	};

	const handleScanResult = (result: string) => {
		router.push(result.toLowerCase());
		setResult(result);
		setOpen(true);
		setScanning(false);
		setScanCount(scanCount + 1);

		const updatedHistory = [result, ...scannedHistory];
		setScannedHistory(updatedHistory);
		localforage.setItem('scannedHistory', updatedHistory);

		if (scanCount + 1 >= 10) {
			scannerRef.current?.destroy();
		}
	};

	useEffect(() => {
		const videoElement = document.getElementById(
			'video'
		) as HTMLVideoElement;

		scannerRef.current = new QrScanner(videoElement, handleScanResult);

		if (scanning) {
			scannerRef.current?.start();
		}

		return () => {
			scannerRef.current?.destroy();
		};
	}, [scanning]);

	return (
		<div className=''>
			<div className='w-full max-w-lg'>
				<Card className='w-full aspect-square overflow-hidden'>
					<video
						className='h-full w-full object-cover'
						id='video'
					/>
				</Card>
				<Button
					className='mt-4 w-full'
					onClick={startScan}
					disabled={scanning || scanCount >= 10}
				>
					Start Scan
				</Button>
			</div>
			{result && (
				<Card className='p-3 border border-primary w-[250px] overflow-hidden mb-5'>
					<QRCode
						value={result}
						size={224}
						className='m-auto'
					/>
				</Card>
			)}
			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				<DialogContent className='bg-secondary'>
					<div className='max-w-60 w-full mx-auto flex-col'>
						<div className='flex flex-col items-center gap-5 mb-5'>
							<div className='h-20 w-20 text-awesome-foreground'>
								{successIcon}
							</div>
							<div className='text-xl'>
								QR Code Scanned
							</div>
						</div>
						<div className='flex flex-col text-center mb-5'>
							<div>Result</div>
							<div>{result}</div>
						</div>
						<div className='flex flex-col gap-3'>
							<Button
								className='rounded-xl flex gap-2'
								onClick={() => {
									navigator.clipboard.writeText(
										result as string
									);
									toast({
										title: 'COPIED!!!',
										type: 'background',
									});
								}}
							>
								<div className='h-4 w-4'>
									{copyIcon}
								</div>
								Copy
							</Button>
							{/* <Button
								onClick={() => {
									setResult(null);
									const videoElement =
										document.getElementById(
											'video'
										) as HTMLVideoElement;
									const scanner = new QrScanner(
										videoElement,
										() => {}
									);
									scanner.start();
								}}
								className='rounded-xl'
							>
								Scan New
							</Button> */}
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<div className='mt-10'>
				<h2 className='text-lg font-semibold'>Scanned History</h2>
				<Separator />
				<ul className='mt-2 space-y-2'>
					{scannedHistory.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
