import { createClient } from '@supabase/supabase-js';

import { SUPABASE_URL } from './config';
import { useRef } from 'react';

let supabase;

export const getSupabase = (token) => {
	if (!supabase && token) {
		supabase = createClient(SUPABASE_URL, token, {
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
	const accessToken = localStorage.getItem('accessToken');
	const supabase = useRef(getSupabase(accessToken));

	return supabase.current;
};
