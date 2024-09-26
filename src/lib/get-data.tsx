import { getServerSession } from 'next-auth';
import { API, URLS } from './consts';
import { options } from '@/app/api/auth/options';
import { cookies } from 'next/headers';

export const getSSession = async () => {
	const session = await getServerSession(options);
	return {
		access_token: session?.user.access_token,
		role: session?.user.role,
	};
};

export const getUserMe = async () => {
	const session = await getSSession();
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': process.env.API_SECRET || '',
		Authorization: `Bearer ${session.access_token}`,
	};
	const url =
		API +
		(session.role?.toLowerCase() === 'agent'
			? URLS.agent.me
			: URLS.admin.me);
	const res = await fetch(url, { headers, cache: 'no-store' });
	if (!res.ok) return undefined;
	if (session.role?.toLowerCase() === 'agent') {
		const data: Promise<IAgentMe> = await res.json();
		const agent = (await data).data.agent;
		return agent;
	} else {
		const data: Promise<IAdminMe> = await res.json();
		const admin = (await data).data.admin;
		return admin;
	}
};

export const getDashboard = async (duration?: '1D' | '1M' | '1Y') => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url =
			API +
			// URLS.dashboard +
			URLS.dashboard.default +
			`${duration ? '?period=' + duration : ''}`;
		// const res = await fetch(url, { headers, cache: 'no-store' });
		const res = await fetch(url, { headers });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const data: Promise<IDashboard> = await res.json();
		return data;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardTotalYearlyRevenue = async (
	type?: ITotalDashboard
) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = `${API}${URLS.dashboard.total_revenue_yearly}${
			type ? '?type=' + type : ''
		}`;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const revenueYearlyTotal: number = data.total;
		return revenueYearlyTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardTotalRevenue = async (
	start_date: string,
	end_date: string
) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = `${API}${URLS.transactions['total-revenue']}?start_date=${start_date}&end_date=${end_date}`;
		const res = await fetch(url, { headers, cache: 'no-store' });
		const result = await res.json();
		console.log({
			start_date,
			end_date,
			url,
			result: result.data,
			error: result.errors,
		});

		if (!result.status || !result.data) {
			console.error(`HTTP error! Status: ${res.status}`);
			return undefined;
		}

		const revenueYearlyTotal = result.data;
		return revenueYearlyTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

// export const getDashboardTotalYearlyRevenue = async (
// 	type?: ITotalDashboard
// ) => {
// 	const session = await getSSession();
// 	const headers = {
// 		'Content-Type': 'application/json',
// 		'api-secret': process.env.API_SECRET || '',
// 		Authorization: `Bearer ${session.access_token}`,
// 	};
// 	const url = `${API}${URLS.dashboard.total_revenue_yearly}${
// 		type ? '?type=' + type : ''
// 	}`;

// 	const res = await fetch(url, { headers, cache: 'no-store' });

// 	console.log({ session, headers, url, response: await res.json() });
// 	try {
// 		if (!res.ok) {
// 			if (res.status === 429) {
// 				// Handle 429 (Too Many Requests) error
// 				console.error(
// 					'Too Many Requests. Please retry after a while.'
// 				);
// 			} else {
// 				console.error(`HTTP error! Status: ${res.status}`);
// 			}

// 			return undefined;
// 		}

// 		const { data } = await res.json();
// 		const revenueYearlyTotal: number = data.total;
// 		return revenueYearlyTotal;
// 	} catch (error: any) {
// 		// Handle other errors (e.g., network issues, JSON parsing errors)
// 		console.error('An error occurred:', error.message);
// 		return undefined;
// 	}
// };

export const getDashboardTotalMonthlyRevenue = async (
	type?: ITotalDashboard
) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = `${API}${URLS.dashboard.total_revenue_monthly}${
			type ? '?type=' + type : ''
		}`;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const revenueMonthlyTotal: number = data.total;
		return revenueMonthlyTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};
export const getDashboardTotalWeeklyRevenue = async (
	type?: ITotalDashboard
) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};

		const url = `${API}${URLS.dashboard.total_revenue_weekly}${
			type ? '?type=' + type : ''
		}`;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const revenueMonthlyTotal: number = data.total;
		return revenueMonthlyTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};
export const getDashboardTotalDailyRevenue = async (type?: ITotalDashboard) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};

		const url = `${API}${URLS.dashboard.total_revenue_daily}${
			type ? '?type=' + type : ''
		}`;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const revenueDailyTotal: number = data.total;
		return revenueDailyTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardTotalTrackerFees = async () => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = API + URLS.dashboard.total_tracker_yearly;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const trackerTotal: number = data.sum;
		return trackerTotal;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardBlacklistedAdmin = async () => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = API + URLS.dashboard.blacklisted_admin;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const blacklistedAdmins: IAdmin[] = data.blacklisted_admins;
		return blacklistedAdmins;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardActivities = async (amount: string) => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = API + URLS.dashboard.activities_with_limit + `/${amount}`;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const all_activities: IActivity[] = data.activities;
		return all_activities;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};

export const getDashboardEarningRevenueChart = async () => {
	try {
		const session = await getSSession();
		const headers = {
			'Content-Type': 'application/json',
			'api-secret': process.env.API_SECRET || '',
			Authorization: `Bearer ${session.access_token}`,
		};
		const url = API + URLS.dashboard.activities_with_limit;
		const res = await fetch(url, { headers, cache: 'no-store' });

		if (!res.ok) {
			// Handle non-2xx HTTP errors
			if (res.status === 429) {
				// Handle 429 (Too Many Requests) error
				console.error(
					'Too Many Requests. Please retry after a while.'
				);
			} else {
				console.error(`HTTP error! Status: ${res.status}`);
			}

			return undefined;
		}

		const { data } = await res.json();
		const all_activities: IActivity[] = data.activities;
		return all_activities;
	} catch (error: any) {
		// Handle other errors (e.g., network issues, JSON parsing errors)
		console.error('An error occurred:', error.message);
		return undefined;
	}
};
