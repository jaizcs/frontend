'use client';

import { Send } from 'lucide-react';
import * as React from 'react';

import { useSupabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

export function ChatBox({ ticketId, userId, initialMessages }) {
	const supabase = useSupabase();
	const navigate = useNavigate();

	const [input, setInput] = React.useState('');
	const inputLength = input.trim().length;

	const [messages, setMessages] = React.useState(initialMessages);
	const [mode, setMode] = React.useState('CHAT'); // 'CHAT' || 'RESOLVE'
	const scrollAreaRef = React.useRef(null);

	const [resolution, setResolution] = React.useState('');

	async function sendMessage(message) {
		await supabase.from('Messages').insert({
			message,
			role: 'assistant',
			TicketId: ticketId,
		});
	}

	async function resolveTicket() {
		await supabase
			.from('Tickets')
			.update({
				resolution,
				status: 'resolved',
			})
			.eq('id', ticketId);

		await supabase.from('Messages').insert({
			role: 'system',
			message: 'CONFIRMATION',
			TicketId: ticketId,
		});
	}

	React.useEffect(() => {
		// subscribe
		if (supabase) {
			supabase.setRealtimeAuth();

			supabase
				.channel(`#${ticketId}-messages`)
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'Tickets',
						filter: `UserId=eq.${userId}`,
					},
					() => navigate('/conversations'),
				)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'Messages',
						filter: `TicketId=eq.${ticketId}`,
					},
					(payload) => {
						setMessages((old) => [
							...old,
							{
								role: payload.new.role,
								message: payload.new.message,
							},
						]);
					},
				)
				.subscribe();
		}
	});

	React.useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop =
				scrollAreaRef.current.scrollHeight;
		}
	}, [messages]);

	React.useEffect(() => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop =
				scrollAreaRef.current.scrollHeight;
		}
	}, [mode]);

	return mode === 'RESOLVE' ? (
		<ResolveForm
			ticketId={ticketId}
			setMode={setMode}
			resolution={resolution}
			setResolution={setResolution}
			resolveTicket={resolveTicket}
		/>
	) : (
		<>
			<Card className="relative h-full overflow-hidden">
				<CardHeader className="absolute top-0 inset-x-0 pb-3 flex flex-row items-center bg-white backdrop-blur-md bg-opacity-90">
					<div className="flex items-center space-x-4">
						<Button
							variant="outline"
							onClick={() => setMode('RESOLVE')}
						>
							Mark as resolved
						</Button>
						<div>
							<p className="text-sm font-bold leading-none">
								#{ticketId}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent
					ref={scrollAreaRef}
					className="px-6 py-24 h-full overflow-scroll"
				>
					<div className="space-y-4">
						{messages.map((message, index) =>
							message.role === 'system' &&
							message.message === 'CONFIRMATION' ? null : (
								<div
									key={index}
									className={cn(
										'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
										message.role !== 'customer'
											? 'ml-auto bg-primary text-primary-foreground'
											: 'bg-muted',
									)}
								>
									{message.message}
								</div>
							),
						)}
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

function ResolveForm({
	ticketId,
	setMode,
	resolution,
	setResolution,
	resolveTicket,
}) {
	const id = React.useId();
	const [fieldErrors, setFieldErrors] = React.useState({});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Mark #{ticketId} as resolved</CardTitle>
				<CardDescription>Provide the resolution below:</CardDescription>
			</CardHeader>
			<CardContent className="relative pt-3 overflow-hidden">
				<div className="grid gap-2">
					<Textarea
						id={`description-${id}`}
						placeholder="Please be as clear and as concise as possible."
						className="h-64"
						value={resolution}
						onChange={(e) => {
							setResolution(e.target.value);
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
				<Button variant="ghost" onClick={() => setMode('CHAT')}>
					Back to chat
				</Button>
				<Button onClick={resolveTicket} className="w-24">
					Submit
				</Button>
			</CardFooter>
		</Card>
	);
}
