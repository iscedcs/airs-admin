'use server';

import { cookies } from 'next/headers';
import { signOut } from 'next-auth/react';

export async function fullSignOut() {
	cookies().delete('access_token');
	cookies().delete('role');
	cookies().delete('id');
	signOut();
}
