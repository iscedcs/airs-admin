import { vehicle } from '@/db/schema';
import db from '@/lib/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// REVENUE REPORT

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get('type');
		const start_date = searchParams.get('start_date');
		const end_date = searchParams.get('end_date');

		// const vehicleResult = await db
		// 	.select(filters)
		// 	.from(vehicle)
		// 	.limit(limit);

		return NextResponse.json(
			{ name: 'REVENUE REPORT', type, start_date, end_date },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
