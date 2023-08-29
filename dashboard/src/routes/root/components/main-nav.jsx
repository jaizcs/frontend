import { cn } from '@/lib/utils';
import { Link, NavLink } from 'react-router-dom';

export function MainNav({ className, ...props }) {
	return (
		<nav
			className={cn(
				'flex items-center space-x-4 lg:space-x-6',
				className,
			)}
			{...props}
		>
			<NavLink
				to="/support-tickets"
				className={({ isActive, isPending }) =>
					cn(
						'text-sm font-medium transition-colors hover:text-primary',
						isActive ? 'font-bold' : '',
					)
				}
			>
				Support Tickets
			</NavLink>
			<NavLink
				to="/conversations"
				className={({ isActive, isPending }) =>
					cn(
						'text-sm font-medium text-muted-foreground transition-colors hover:text-primary mx-auto ',
						isActive ? 'font-bold text-black' : '',
					)
				}
			>
				<div className="flex gap-2 ">
					<span>Conversations </span>
					<div className="text-[10px] font-thin border-solid border-2 rounded-full w-5 h-5 flex items-center justify-center bg-gray-50">
						8
					</div>
				</div>
			</NavLink>
		</nav>
	);
}
