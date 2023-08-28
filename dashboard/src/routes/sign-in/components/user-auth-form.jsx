import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from 'react-router-dom';

export function UserAuthForm({ className, ...props }) {
	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form method="post">
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
						/>
					</div>
					<Button>Sign In with Email</Button>
				</div>
			</Form>
		</div>
	);
}
