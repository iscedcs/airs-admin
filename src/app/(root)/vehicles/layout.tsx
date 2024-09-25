import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Transpay - Vehicles',
	description: 'List of all vehicles',
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='p-5 w-full h-full flex flex-col'>{children}</div>;
}
