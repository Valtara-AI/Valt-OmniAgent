import type { NextRequest } from 'next/server';

// Placeholder middleware reserved for future auth/headers.
export function middleware(_req: NextRequest) {
	// No-op: keeping existing SPA auth model; can add redirects later.
	return;
}

export const config = {
	matcher: ['/((?!_next|.*\..*).*)'],
};
