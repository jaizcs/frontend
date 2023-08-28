import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Simulate a database read for tasks.
export async function loader({ request }) {
	const token = localStorage.getItem('accessToken');
	const url = new URL(request.url);
	const ticketsData = await axios.get(
		BASE_URL +
			'/tickets' +
			(url.searchParams.size > 0 ? '?' + url.searchParams.toString() : ''),
		{
			headers: {
				Authorization: token,
			},
		},
	);
	const tickets = ticketsData.data;
	console.log(tickets, '<<');
	return tickets;
}

export default function SupportTicketsRoute() {
	const tickets = useLoaderData();

	return (
		<div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
			<DataTable data={tickets.data} columns={columns} />
		</div>
	);
}
