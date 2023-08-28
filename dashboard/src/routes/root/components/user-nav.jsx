import { CaretSortIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGlobalStore } from '@/store';
import { useNavigate } from 'react-router-dom';

export function UserNav() {
	const navigate = useNavigate();

	const user = useGlobalStore((state) => state.user);

	function signOut() {
		localStorage.removeItem('accessToken');
		useGlobalStore.setState({
			user: null,
		});
		navigate('/sign-in');
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="min-w-[200px] gap-x-4">
					<div className="flex items-center">
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage src={`https://avatar.vercel.sh/member.png`} />
							<AvatarFallback>CS</AvatarFallback>
						</Avatar>
						{user.name}
					</div>
					<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuItem
					onClick={() => console.log('settings')}
					className="cursor-pointer"
				>
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
