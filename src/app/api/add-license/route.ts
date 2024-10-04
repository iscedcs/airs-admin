import { API, URLS } from '@/lib/consts';
import { getSSession } from '@/lib/get-data';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
	const { access_token } = await getSSession();

	const body: IAddLicenseForm = await req.json();
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${access_token}`,
	};

	try {
		const url = `${API}${URLS.driver.all}/${body.driver_id}/license`;
		const response = await fetch(url, {
			method: 'PUT',
			headers,
			body: JSON.stringify({
				license_number: body.license_number,
				license_name: body.license_name,
				license_expiry: body.license_expiry,
			}),
		});
		const result = await response.json();
		if (!response.ok) {
			throw new Error(`Something Went wrong ${response.statusText}`);
		} else {
			return NextResponse.json(result);
		}
	} catch (error: any) {
		throw new Error(`Something Went wrong ${error?.message}`);
	}
}
