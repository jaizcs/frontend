import { createBrowserRouter, redirect } from 'react-router-dom';
import RootRoute from './routes/root';
import SupportTicketsRoute from './routes/support-tickets';
import SignInRoute from './routes/sign-in';

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
	},
	{
		children: [
			{
				element: <SupportTicketsRoute />,
				path: '/support-tickets',
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
	},
]);
