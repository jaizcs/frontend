import { Link, Outlet, redirect, useNavigate, useHref } from 'react-router-dom';

import { MainNav } from './components/main-nav';
import TeamSwitcher from './components/availability-toggle';
import { UserNav } from './components/user-nav';
import axios from 'axios';
import { useGlobalStore } from '@/store';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
	'http://localhost:54321',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
);

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loader() {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		return redirect('/sign-in');
	}
	const me = await axios.get(BASE_URL + '/users/me', {
		headers: {
			Authorization: token,
		},
	});
	const { data } = await axios.get(BASE_URL + '/user-queue', {
		headers: {
			Authorization: token,
		},
	});

	useGlobalStore.setState({
		user: me.data,
		conversations: (
			await supabase
				.from('Tickets')
				.select('*', { count: 'exact' })
				.eq('status', 'in progress')
				.eq('UserId', me.data.id)
		).count,
		isAvailable: data.isAvailable,
	});

	return null;
}

export default function RootRoute() {
	const user = useGlobalStore((store) => store.user);
	const navigate = useNavigate();
	const href = useHref();

	const [channel, setChannel] = useState(() => {
		supabase
			.channel('schema-db-changes')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'Tickets',
					filter:
						user.role === 'staff'
							? `UserId=eq.${user.id}`
							: undefined,
				},
				() => navigate(href),
			)
			.subscribe();
	});

	return (
		<div className="hidden flex-col md:flex">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					<Link to="/" className="font-bungee text-2xl">
						YUJIN
					</Link>

					<MainNav className="mx-6" />
					<div className="ml-auto flex items-center space-x-4">
						<TeamSwitcher />
						<UserNav />
					</div>
				</div>
			</div>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
