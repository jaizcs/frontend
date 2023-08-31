import axios from 'axios';
import { useEffect } from 'react';
import {
	Link,
	Outlet,
	redirect,
	useNavigate,
	useHref,
	useNavigation,
} from 'react-router-dom';

import { useGlobalStore } from '@/store';
import { useSupabase, getSupabase } from '@/lib/supabase';
import { MainNav } from './components/main-nav';
import TeamSwitcher from './components/availability-toggle';
import { UserNav } from './components/user-nav';
import { Loader2 } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loader() {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		return redirect('/sign-in');
	}

	try {
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
				await getSupabase(token)
					.from('Tickets')
					.select('*', { count: 'exact' })
					.eq('status', 'in progress')
					.eq('UserId', me.data.id)
			).count,
			isAvailable: data.isAvailable,
		});

		return null;
	} catch (err) {
		localStorage.removeItem('accessToken');
		return redirect('/sign-in');
	}
}

export default function RootRoute() {
	const user = useGlobalStore((store) => store.user);
	const navigate = useNavigate();
	const { state } = useNavigation();
	const supabase = useSupabase();

	useEffect(() => {
		if (supabase) {
			supabase.setRealtimeAuth();

			supabase
				.channel('conversations')
				.on(
					'postgres_changes',
					{
						event: '*',
						schema: 'public',
						table: 'Tickets',
						filter:
							user.role === 'staff'
								? `UserId=eq.${user.id}`
								: undefined,
					},
					() =>
						navigate(
							window.location.pathname + window.location.search,
							{
								replace: true,
							},
						),
				)
				.subscribe();
		}
	}, []);

	return (
		<div className="hidden flex-col h-full md:flex overflow-hidden">
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
			{state === 'loading' ? (
				<main className="flex-1 flex items-center justify-center">
					<Loader2 size={32} className="animate-spin" />
				</main>
			) : (
				<Outlet />
			)}
		</div>
	);
}
