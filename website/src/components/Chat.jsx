'use client';

import * as React from 'react';
import { Loader2, Send } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { create } from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const YUJIN_WIDGET_KEY = process.env.NEXT_PUBLIC_YUJIN_WIDGET_KEY;

const useChatStore = create((set) => ({
	messages: [
		{
			role: 'system',
			message: 'CONFIRMATION',
		},
	],
	user: null,
	isLoading: false,
	isSubscribed: false,
	createTicket: async (form) => {
		set({
			isLoading: true,
		});

		// create ticket
		const {
			data: { id, accessToken },
		} = await axios.post(API_URL + '/tickets', form, {
			headers: {
				authorization: YUJIN_WIDGET_KEY,
			},
		});

		const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			global: {
				fetch,
			},
		});

		// subscribe to supabase database changes
		supabase
			.channel(`messages`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'Messages',
					filter: `TicketId=eq.${id}`,
				},
				(payload) => {
					const {
						new: { role, message },
					} = payload;

					set((store) => ({
						messages: [...store.messages, { role, message }],
					}));
				},
			)
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					set({
						isSubscribed: true,
					});
				}

				// ask ai
				await axios.get(API_URL + `/tickets/${id}/similarity-search`, {
					headers: {
						Authorization: accessToken,
					},
				});

				set({
					isLoading: false,
				});
			});
	},
	sendMessage: (message) => {
		set((store) => ({
			messages: [
				...store.messages,
				{
					role: 'customer',
					message,
				},
			],
		}));
	},
}));

export function Chat() {
	const [isChatBoxOpen, setIsChatBoxOpen] = React.useState(false);
	const isSubscribed = useChatStore((store) => store.isSubscribed);

	return (
		<div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-y-4">
			<ChatBox />
			{/* {isChatBoxOpen ? (
				isSubscribed ? (
					<ChatBox />
				) : (
					<IssueForm setIsChatBoxOpen={setIsChatBoxOpen} />
				)
			) : null} */}

			<button
				onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
				className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background"
			>
				<svg className="h-10 w-10" viewBox="0 0 40 40" fill="none">
					<path
						d="M14 2C6.268 2 0 6.924 0 13a10.106 10.106 0 0 0 4.6 8.132A14.374 14.374 0 0 1 0 26.286a18.948 18.948 0 0 0 9.714-2.816c1.401.353 2.84.531 4.286.53 7.732 0 14-4.924 14-11S21.732 2 14 2zm-8 8h10v2H6v-2zm16 6H6v-2h16v2z"
						fill="currentColor"
					/>
					<path
						d="M35.4 33.132A10.107 10.107 0 0 0 40 25c0-5.012-4.27-9.232-10.104-10.56C29.01 20.931 22.222 26 14 26a19.412 19.412 0 0 1-1.942-.107C12.638 31.55 18.652 36 26 36a17.476 17.476 0 0 0 4.286-.53A18.949 18.949 0 0 0 40 38.285a14.375 14.375 0 0 1-4.6-5.153z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	);
}

function LoaderEllipsis() {
	return (
		<div className="relative h-5 w-20 flex items-center loader-ellipsis ">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

function ChatBox() {
	const [input, setInput] = React.useState('');
	const inputLength = input.trim().length;

	const messages = useChatStore((store) => store.messages);
	const user = useChatStore((store) => store.user);
	const isLoading = useChatStore((store) => store.isLoading);
	const sendMessage = useChatStore((store) => store.sendMessage);

	return (
		<>
			<Card className="relative w-[360px]">
				<CardHeader className="absolute top-0 inset-x-0 flex flex-row items-center bg-white backdrop-blur-md bg-opacity-90">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarImage
								src="https://avatar.vercel.sh/customer-support.png"
								alt="Image"
								className={!user ? 'grayscale' : ''}
							/>
							<AvatarFallback>OM</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">
								{user ? user.name : 'Yujin'}
							</p>
							<p className="text-sm text-muted-foreground">
								{user ? 'Customer Support' : 'Assistant'}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent className="px-6 py-24 min-h-[160px] max-h-[640px] overflow-scroll">
					<div className="space-y-4">
						{messages.map((message, index, arr) =>
							message.role === 'system' &&
							message.message === 'CONFIRMATION' ? (
								index === arr.length - 1 ? (
									<div
										key={index}
										className={cn(
											'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted',
										)}
									>
										<p>
											Are you satisfied with the solution
											provided?
										</p>
										<div className="flex gap-x-2">
											<Button
												variant="outline"
												className="flex-1"
											>
												Yes
											</Button>
											<Button
												variant="outline"
												className="flex-1"
											>
												No
											</Button>
										</div>
									</div>
								) : null
							) : (
								<div
									key={index}
									className={cn(
										'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
										message.role === 'customer'
											? 'ml-auto bg-primary text-primary-foreground'
											: 'bg-muted',
									)}
								>
									{message.message}
								</div>
							),
						)}
						{isLoading ? (
							<div
								className={cn(
									'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted',
								)}
							>
								<LoaderEllipsis />
							</div>
						) : null}
					</div>
				</CardContent>
				<CardFooter className="absolute bottom-0 inset-x-0 pt-6 bg-white backdrop-blur-md bg-opacity-90">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							if (inputLength === 0) return;
							sendMessage(input);
							setInput('');
						}}
						className="flex w-full items-center space-x-2"
					>
						<Input
							id="message"
							placeholder="Type your message..."
							className="flex-1"
							autoComplete="off"
							value={input}
							onChange={(event) => setInput(event.target.value)}
						/>
						<Button
							type="submit"
							size="icon"
							disabled={inputLength === 0}
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</Button>
					</form>
				</CardFooter>
			</Card>
		</>
	);
}

export function IssueForm({ setIsChatBoxOpen }) {
	const id = React.useId();
	const [form, setForm] = React.useState({
		type: 'billing',
		description: '',
	});
	const [fieldErrors, setFieldErrors] = React.useState({});
	const isLoading = useChatStore((store) => store.isLoading);
	const createTicket = useChatStore((store) => store.createTicket);

	const handleSubmit = async () => {
		if (!form.description.trim()) {
			setFieldErrors({
				...fieldErrors,
				description: 'Issue description is required',
			});
		} else {
			await createTicket(form);
		}
	};

	return (
		<Card className="w-[360px]">
			<CardHeader>
				<CardTitle>Ask us for help</CardTitle>
				<CardDescription>
					What area are you having problems with?
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor={`area-${id}`}>About</Label>
					<Select
						defaultValue={form.type}
						onValueChange={(value) =>
							setForm({ ...form, type: value })
						}
					>
						<SelectTrigger id={`area-${id}`} aria-label="About">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="billing">Billing</SelectItem>
							<SelectItem value="technical issue">
								Technical Issue
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="grid gap-2">
					<Label htmlFor={`description-${id}`}>Description</Label>
					<Textarea
						id={`description-${id}`}
						placeholder="Please include all information relevant to your issue."
						className="h-48"
						value={form.description}
						onChange={(e) => {
							setForm({ ...form, description: e.target.value });
							setFieldErrors({
								...fieldErrors,
								description: undefined,
							});
						}}
					/>
					{fieldErrors.description ? (
						<p className="text-sm text-red-600">
							{fieldErrors.description}
						</p>
					) : null}
				</div>
			</CardContent>
			<CardFooter className="justify-between space-x-2">
				<Button variant="ghost" onClick={() => setIsChatBoxOpen(false)}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={isLoading}
					className="w-24"
				>
					{isLoading ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						'Submit'
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
