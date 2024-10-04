import { TRANSACTIONS } from '../../../../data';

export const getTransactions = async (): Promise<IVehicleTransaction[]> =>
	TRANSACTIONS;

export const getChartData = async (): Promise<any[]> => {
	return [1, 2, 3];
};
