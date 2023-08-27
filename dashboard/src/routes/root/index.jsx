import { Outlet } from 'react-router-dom';

import { MainNav } from './components/main-nav';
import TeamSwitcher from './components/team-switcher';
import { UserNav } from './components/user-nav';

export default function RootRoute() {
	return (
		<div className="hidden flex-col md:flex">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					<span className="font-bungee text-2xl">YUJIN</span>

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
