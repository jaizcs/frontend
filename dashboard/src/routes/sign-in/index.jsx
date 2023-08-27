import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from './components/user-auth-form';

export default function AuthenticationPage() {
	return (
		<>
			<div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
				<div className="relative hidden h-full flex-col p-10 text-white dark:border-r bg-foreground lg:flex lg:items-center lg:justify-center">
					<span className="text-9xl font-bungee text-background">YUJIN</span>
				</div>
				<div className="lg:p-8">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">
								Welcome back!
							</h1>
							<p className="text-sm text-muted-foreground">
								Enter your credential below to sign in.
							</p>
						</div>
						<UserAuthForm />
					</div>
				</div>
			</div>
		</>
	);
}
