import { createBrowserRouter, redirect } from 'react-router-dom';
import RootRoute from './routes/root';
import SupportTicketsRoute, {
	loader as supportTicketLoader,
} from './routes/support-tickets';
import SignInRoute from './routes/sign-in';
import { action as signinAction } from './routes/sign-in';
import { loader as rootLoader } from './routes/root';

export const router = createBrowserRouter([
	{
		loader: () => {
			return redirect('/support-tickets');
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
