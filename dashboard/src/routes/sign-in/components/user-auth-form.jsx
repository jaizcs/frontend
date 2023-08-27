import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UserAuthForm({ className, ...props }) {
	const [isLoading, setIsLoading] = React.useState(false);

	async function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="email">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							placeholder="name@mail.com"
							type="email"
							autoCapitalize="none"
							autoComplete="email"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							name="password"
							placeholder="password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Sign In with Email
					</Button>
				</div>
			</form>
		</div>
	);
}
