import { getServerSession } from 'next-auth';
import { API, URLS } from '../consts';
import { options } from '@/app/api/auth/options';

export const getAllActivities = async (o?: {
	page?: string;
	limit?: string;
}) => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = `${API}${URLS['audit-trails'].all}?page=${
		o?.page ?? 1
	}&limit=${o?.limit ?? 15}`;
	const res = await fetch(url, { headers, cache: 'no-store' });
	const result = await res.json();
	console.log({ url, result });
	if (!res.status) return undefined;
	console.log({ result: result.data });
	const activities: {
		rows: IActivity[];
		meta: { total: number; total_pages: number; page: number };
	} = result.data;
	return activities;
};
export const getActivitiesByUser = async (o: {
	page?: string;
	limit?: string;
	user_id: string;
}) => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = `${API}${URLS['audit-trails'].user}?page=${
		o?.page ?? 1
	}&limit=${o?.limit ?? 15}&user_id=${o.user_id}`;
	const res = await fetch(url, { headers, cache: 'no-store' });
	const result = await res.json();
	console.log({ url, result });
	if (!res.status) return undefined;
	const activities: {
		rows: IActivity[];
		meta: { total: number; total_pages: number; page: number };
	} = await result;
	return activities;
};
export const getActivitiesByVehicle = async (o: {
	page?: string;
	limit?: string;
	user_id: string;
}) => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = `${API}${URLS['audit-trails'].vehicle}?page=${
		o?.page ?? 1
	}&limit=${o?.limit ?? 15}&user_id=${o.user_id}`;
	const res = await fetch(url, { headers, cache: 'no-store' });
	const result = await res.json();
	console.log({ url, result });
	if (!res.ok) return undefined;
	const activities: {
		rows: IActivity[];
		meta: { total: number; total_pages: number; page: number };
	} = await result;
	return activities;
};
