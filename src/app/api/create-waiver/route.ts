import { NextRequest, NextResponse } from 'next/server';
import { API, URLS } from '@/lib/consts';
import { getSSession } from '@/lib/get-data';
import { waiverFormValues } from '@/components/forms/new-waiver-form';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
	const { access_token } = await getSSession();
	const body: waiverFormValues = await req.json();
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${access_token}`,
	};
	const payload = {
		vehicle_id: body.id,
		reason: body.reason,
		start_date: body.start_date,
		end_date: body.end_date,
	};
	const url = API + URLS.vehicle.all + '/' + body.id + '/waiver';
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
		});

		const result = await response.json();
		if (!response.ok) {
			// throw new Error(`Something Went wrong ${response.statusText}`);
			return NextResponse.json({ error: result }, { status: 409 });
		} else {
			return NextResponse.json(result);
		}
	} catch (error: any) {
		return error?.message;
	}
}

export async function PUT(req: NextRequest) {
	const { access_token } = await getSSession();
	const body: waiverFormValues = await req.json();
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${access_token}`,
	};

	try {
		const url = API + URLS.vehicle.all + '/' + body.id + '/waiver';
		const response = await fetch(url, {
			method: 'PUT',
			headers,
			body: JSON.stringify(body),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new Error(`Something Went wrong ${response.statusText}`);
		} else {
			return NextResponse.json(result);
		}
	} catch (error: any) {
		return error?.message;
	}
}

export async function DELETE(req: NextRequest) {
	const body: any = await req.json();
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
	};

	try {
		const url = `${API}${URLS.vehicle.all}/${body.id}/waiver`;
		const response = await fetch(url, {
			method: 'DELETE',
			headers,
		});
		const result = await response.json();
		if (!result.success) {
			return NextResponse.json(response.statusText);
		} else {
			return NextResponse.json(result);
		}
	} catch (error: any) {
		return error?.message;
	}
}
