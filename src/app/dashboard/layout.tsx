import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background">
			{/* Keep the dashboard layout simple and allow the app-level Layout to wrap as needed */}
			{children}
		</div>
	)
}
