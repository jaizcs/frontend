'use client';

import * as React from 'react';
import {
	CaretSortIcon,
	CheckIcon,
	PlusCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function postQue() {
	const token = localStorage.getItem('accessToken');
	await axios.post(BASE_URL + '/user-queue', null, {
		headers: {
			Authorization: token,
		},
	});
	return null;
}

async function deleteQue() {
	const token = localStorage.getItem('accessToken');
	await axios.delete(BASE_URL + '/user-queue', {
		headers: {
			Authorization: token,
		},
	});
	return null;
}

export default function TeamSwitcher({ className }) {
	const [open, setOpen] = React.useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
	const [selectedTeam, setSelectedTeam] = React.useState('Unavailable');

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a team"
					className={cn('w-[200px] justify-between', className)}
				>
					<Avatar className="mr-2 h-5 w-5">
						<AvatarImage
							src={`https://avatar.vercel.sh/${selectedTeam}.png`}
							alt={selectedTeam.label}
						/>
						<AvatarFallback>SC</AvatarFallback>
					</Avatar>
					{selectedTeam}
					<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						{['Available', 'Unavailable'].map((availability) => (
							<CommandItem
								key={availability}
								onSelect={async () => {
									setSelectedTeam(availability);
									setOpen(false);
									if (availability === 'Available') {
										await postQue();
									} else {
										await deleteQue();
									}
								}}
								className="text-sm"
							>
								<Avatar className="mr-2 h-5 w-5">
									<AvatarImage
										src={`https://avatar.vercel.sh/${availability}.png`}
										alt={availability}
									/>
								</Avatar>
								{availability}
								<CheckIcon
									className={cn(
										'ml-auto h-4 w-4',
										selectedTeam === availability
											? 'opacity-100'
											: 'opacity-0',
									)}
								/>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
