import { createBrowserRouter, redirect } from 'react-router-dom';
import RootRoute from './routes/root';
import SupportTicketsRoute, {
	loader as supportTicketLoader,
} from './routes/support-tickets';
import SignInRoute from './routes/sign-in';
import { action as signinAction } from './routes/sign-in';
import { loader as rootLoader } from './routes/root';
import {
	ConversationsRoute,
	loader as conversationsLoader,
} from './routes/conversations';

export const router = createBrowserRouter([
	{
		loader: () => {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				return redirect('/sign-in');
			}
			return redirect('/support-tickets?status=in+progress');
		},
		path: '/',
	},
	{
		element: <SignInRoute />,
		path: '/sign-in',
		action: signinAction,
	},
	{
		children: [
			{
				element: <SupportTicketsRoute />,
				path: '/support-tickets',
				loader: supportTicketLoader,
			},
			{
				element: <ConversationsRoute />,
				loader: conversationsLoader,
				path: '/conversations',
			},
			{
				path: '/settings',
				children: [
					{
						path: 'widget-tokens',
					},
				],
			},
		],
		element: <RootRoute />,
		loader: rootLoader,
	},
]);
