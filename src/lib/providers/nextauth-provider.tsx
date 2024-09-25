'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = React.useState<Session | null>();
	return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;
