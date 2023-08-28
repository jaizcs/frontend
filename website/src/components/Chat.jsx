'use client';

import * as React from 'react';
import { Send } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function Chat() {
	const [isChatBoxOpen, setIsChatBoxOpen] = React.useState(false);

	return (
		<div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-y-4">
			{isChatBoxOpen ? <ChatBox /> : null}
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

function ChatBox() {
	const [messages, setMessages] = React.useState([
		{
			role: 'agent',
			content: 'Hi, how can I help you today?',
		},
		{
			role: 'user',
			content: "Hey, I'm having trouble with my account.",
		},
		{
			role: 'agent',
			content: 'What seems to be the problem?',
		},
		{
			role: 'user',
			content: "I can't log in.",
		},
	]);
	const [input, setInput] = React.useState('');
	const inputLength = input.trim().length;

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center">
					<div className="flex items-center space-x-4">
						<Avatar>
							<AvatarImage src="/avatars/01.png" alt="Image" />
							<AvatarFallback>OM</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium leading-none">
								Sofia Davis
							</p>
							<p className="text-sm text-muted-foreground">
								m@example.com
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{messages.map((message, index) => (
							<div
								key={index}
								className={cn(
									'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
									message.role === 'user'
										? 'ml-auto bg-primary text-primary-foreground'
										: 'bg-muted',
								)}
							>
								{message.content}
							</div>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							if (inputLength === 0) return;
							setMessages([
								...messages,
								{
									role: 'user',
									content: input,
								},
							]);
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
