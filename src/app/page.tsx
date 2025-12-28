"use client";
import { useRouter } from "next/navigation";
import { LandingPage } from "../components/pages/landing-page";
import { RouterLayout } from "../components/router-layout";

export default function Home() {
	const router = useRouter();
	return (
		<RouterLayout>
			<LandingPage 
				onGetDemo={() => router.push('/signin')} 
				onAbout={() => router.push('/about')} 
				onViewDashboard={() => router.push('/signin')} 
			/>
		</RouterLayout>
	);
}

