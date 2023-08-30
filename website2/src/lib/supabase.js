import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL } from './config';
import { useRef } from 'react';

let supabase;

export const getSupabase = () => {
	let ticket;

	try {
		ticket = JSON.parse(localStorage.getItem('yujin:ticket'));
	} catch {
		ticket = {};
	}

	if (ticket && ticket.accessToken) {
		supabase = createClient(SUPABASE_URL, ticket.accessToken, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			global: {
				fetch,
			},
		});
	}

	return supabase;
};

export const useSupabase = () => {
	const supabase = useRef(getSupabase());

	return supabase.current;
};
