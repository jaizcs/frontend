import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import { useRef } from 'react';

let supabase;

export const getSupabase = () => {
	let ticket;

	try {
		ticket = JSON.parse(localStorage.getItem('yujin:ticket'));
	} catch {
		ticket = {};
	}

	if (!supabase && ticket && ticket.accessToken) {
		supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			global: {
				fetch,
				headers: {
					authorization: `Bearer ${ticket.accessToken}`,
				},
			},
		});

		supabase.setRealtimeAuth = () => {
			supabase.realtime.setAuth(ticket.accessToken);
		};
	}

	return supabase;
};

export const useSupabase = () => {
	const supabase = useRef(getSupabase());

	return supabase.current;
};
