import { create } from 'zustand';

export const useGlobalStore = create(() => ({ user: null, conversations: 0 }));
