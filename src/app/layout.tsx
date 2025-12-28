import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
import { AuthProvider } from "../components/auth-context";
import { ThemeProvider } from "../components/theme-provider";
import "../styles/globals.css";

export const metadata: Metadata = {
	title: "Valt OmniAgent UI Design System",
	description: "AI-powered lead reactivation platform UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// Add suppressHydrationWarning on body to safely ignore extension-injected attributes (e.g. Grammarly)
	// and keep markup stable between server & client.
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className="antialiased">
				<ThemeProvider defaultTheme="light" storageKey="valt-ui-theme">
					<AuthProvider>
						{children}
					</AuthProvider>
				</ThemeProvider>
				{/* LeadConnector Chat Widget */}
				<Script
					id="leadconnector-chat-widget"
					src="https://widgets.leadconnectorhq.com/loader.js"
					strategy="afterInteractive"
					data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
					data-widget-id="67ff121f119caa7e6578236b"
				/>
			</body>
		</html>
	);
}
