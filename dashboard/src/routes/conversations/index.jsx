import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

import { ChatBox } from '@/components/chat';
import { BASE_URL } from '@/lib/config';
import { getSupabase } from '@/lib/supabase';

export const loader = async () => {
	const token = localStorage.getItem('accessToken');

	const supabase = getSupabase(token);

	const { data: user } = await axios.get(BASE_URL + '/users/me', {
		headers: {
			Authorization: token,
		},
	});

	const { data: conversations, error } = await supabase
		.from('Tickets')
		.select(
			`
            id,
            UserId,
            Messages (
                id,
                message,
                role,
                createdAt,
                updatedAt
            )
        `,
		)
		.eq('UserId', user.id)
		.eq('status', 'in progress');

	return conversations;
};

export function ConversationsRoute() {
	const conversations = useLoaderData();

	return (
		<main className="h-full overflow-hidden">
			{conversations.length ? (
				<div className="h-full px-6 py-12 grid grid-cols-4 gap-x-4">
					{conversations.map((conversation) => (
						<ChatBox
							key={conversation.id}
							ticketId={conversation.id}
							userId={conversation.UserId}
							initialMessages={conversation.Messages.sort(
								(a, b) => a.id - b.id,
							)}
						/>
					))}
				</div>
			) : (
				<div className="h-full flex items-center justify-center">
					<p>There is no on going conversations.</p>
				</div>
			)}
		</main>
	);
}
