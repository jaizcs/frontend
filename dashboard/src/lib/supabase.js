import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import { useRef } from 'react';

let supabase;

export const getSupabase = () => {
	const token = localStorage.getItem('accessToken');

	if (!supabase && token) {
		supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			global: {
				fetch,
				headers: {
					authorization: `Bearer ${token}`,
				},
			},
		});
	}

	supabase.setRealtimeAuth = () => {
		supabase.realtime.setAuth(token);
	};

	return supabase;
};

export const useSupabase = () => {
	const supabase = useRef(getSupabase());

	return supabase.current;
};
