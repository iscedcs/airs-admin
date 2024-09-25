import { getServerSession } from 'next-auth';
import { API, URLS } from '../consts';
import { options } from '@/app/api/auth/options';

export const getAgentMe = async () => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = API + URLS.agent.me;
	const res = await fetch(url, { headers, cache: 'no-store' });
	if (!res.ok) return undefined;

	const data: Promise<IAgentMe> = await res.json();
	const agent = (await data).data.agent;
	return agent;
};

// export const getGreenAgent = async () => {
// 	const session = await getSSession();
// 	const headers = {
// 		'Content-Type': 'application/json',
// 		'api-secret': process.env.API_SECRET || '',
// 		Authorization: `Bearer ${session?.user.access_token}`,
// 	};
// 	const url = API + URLS.green.me;
// 	const res = await fetch(url, { headers, cache: 'no-store' });
// 	if (!res.ok) return undefined;

// 	const data: Promise<IAgentMe> = await res.json();
// 	const agent = (await data).data.agent;
// 	return agent;
// };

export const getGreenAgent = async () => {
	const user: IUser = {
		id: 3,
		admin_id: '1e3a7f0d-ad2a-4d10-9aef-1cde4f686618',
		name: 'Green Agent',
		phone: '+2348061719533',
		image: '',
		password:
			'$2b$10$oAJohuXySSSnCdKpOTj2r.v.EPOXxdMJ3tKr9mH3Ooy0jjVtSJtZ6',
		email: 'green@agent.com',
		role: 'greenengine_agent',
		blacklisted: false,
		createdAt: '2023-11-20T07:49:52.000Z',
		updatedAt: '2023-11-20T07:49:52.000Z',
	};
	return user;
};

export const getAgents = async () => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = API + URLS.agent.all;
	const res = await fetch(url, { headers, next: { revalidate: 0 } });
	if (!res.ok) return undefined;
	const data: Promise<IAgents> = await res.json();
	const agents = (await data).data.agents;
	return agents;
};

export const getAgentById = async (id: string) => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = `${API}${URLS.agent.all}/${id}`;
	const res = await fetch(url, { headers, cache: 'no-store' });
	if (!res.ok) return undefined;
	const result: Promise<IResAgent> = (await res.json()).data;
	const { agent } = await result;
	return agent;
};

export const deleteAgentById = async (id: string) => {
	const session = await getServerSession(options);
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session?.user.access_token}`,
	};
	const url = `${API}${URLS.agent.all}/${id}`;
	const res = await fetch(url, {
		method: 'delete',
		headers,
		cache: 'no-store',
	});
	if (!res.ok) return undefined;
	const data = await res.json();
	const response = await data;
	return response;
};
