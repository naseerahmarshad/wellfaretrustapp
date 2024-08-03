import { Manrope } from "next/font/google";
import "../../css/globals.css"
import "../../css/administrator.css"
import ValidateUser from "./components/ValidateUser";

const manrope = Manrope({ 
	weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap'
});

export const metadata = {
	title: "Admin MyNotes",
	description: "Admin MyNotes",
};

export default function RootLayout({ children }) {
	return (
		<>
			<ValidateUser />
			<html lang="en">
				<link rel="icon" href="/images/favicon.png" />
				<body className={manrope.className}>
					<div className="flex w-full fixed top-0 left-0 z-[-1]">
						<img src="/images/topshapebg.png" alt="topshapebg" />
					</div>
					{children}
				</body>
			</html>
		</>
	);
}
