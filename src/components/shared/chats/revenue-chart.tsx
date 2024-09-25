'use client';

import {
	Area,
	AreaChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export const CustomTooltip = ({
	active,
	payload,
	label,
}: {
	active?: string;
	payload?: any;
	label?: string;
}) => {
	if (active && payload && payload.length) {
		return (
			<div className='w-40 h-16 flex flex-col text-primary border-2 rounded-xl border-primary bg-secondary p-2'>
				<p className='label'>{`${label} : ${payload[0].value}`}</p>
				<p className='intro'>{label}</p>
			</div>
		);
	}

	return null;
};

export function RevenueCharts({
	data,
}: {
	data: { name: string; total: number }[];
}) {
	return (
		<ResponsiveContainer
			width='100%'
			height={400}
		>
			<AreaChart
				width={500}
				height={350}
				data={data}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient
						id='colorTotal'
						x1='0'
						y1='0'
						x2='0'
						y2='1'
					>
						<stop
							offset='5%'
							stopColor='#CABB33'
							stopOpacity={0.8}
						/>
						<stop
							offset='95%'
							stopColor='#CABB33'
							stopOpacity={0}
						/>
					</linearGradient>
				</defs>
				<XAxis
					dataKey='name'
					stroke='#888888'
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `₦${value}`}
				/>
				<Tooltip content={<CustomTooltip />} />
				<Area
					type='monotone'
					dataKey='total'
					stroke='#4F4700'
					fillOpacity={1}
					strokeWidth={2}
					fill='url(#colorTotal)'
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
