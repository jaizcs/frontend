import { Link, Outlet, redirect } from 'react-router-dom';

import { MainNav } from './components/main-nav';
import TeamSwitcher from './components/availability-toggle';
import { UserNav } from './components/user-nav';
import axios from 'axios';
import { useGlobalStore } from '@/store';

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
	useGlobalStore.setState({
		user: me.data,
	});
	return null;
}

export default function RootRoute() {
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
