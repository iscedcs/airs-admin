import { vehicle } from '@/db/schema';
import db from '@/lib/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// REVENUE REPORT

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const requestedFields = searchParams.get('fields');

		// const vehicleResult = await db
		// 	.select(filters)
		// 	.from(vehicle)
		// 	.limit(limit);

		return NextResponse.json('REVENUE STATISTICS', { status: 200 });
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
