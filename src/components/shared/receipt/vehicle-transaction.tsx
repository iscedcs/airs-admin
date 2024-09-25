export default function Receipt({ receipt }: { receipt: IVehiclePayment }) {
	return (
		<div className='max-w-sm'>
			<div>
				<h2 className='text-lg font-medium text-gray-900 text-center'>
					Transaction Receipt
				</h2>
				<p className='mt-1 text-sm text-gray-500'>
					Transaction ID: {receipt.vehicle_transaction_id}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Transaction Date: {receipt.transaction_date}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Vehicle ID: {receipt.vehicle_id}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Description: {receipt.description}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Amount: NGN {receipt.amount}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Payment Gateway Name: {receipt.payment_gateway_name}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Transaction Type: {receipt.transaction_type}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Invoice Number: {receipt.invoice_number}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Invoice Prefix: {receipt.invoice_prefix}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Invoice Details: {receipt.invoice_details}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Payment Type: {receipt.payment_type}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Payment Status: {receipt.payment_status}
				</p>
			</div>
		</div>
	);
}
