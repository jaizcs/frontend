import { cn } from '@/lib/utils';

export function MainNav({ className, ...props }) {
	return (
		<nav
			className={cn(
				'flex items-center space-x-4 lg:space-x-6',
				className,
			)}
			{...props}
		>
			<a
				href="/examples/dashboard"
				className="text-sm font-medium transition-colors hover:text-primary"
			>
				Support Tickets
			</a>
			<a
				href="/examples/dashboard"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Coversations
			</a>
			<a
				href="/examples/dashboard"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Frequently Asked Questions
			</a>
		</nav>
	);
}
