import { Manrope } from "next/font/google";
import "../css/globals.css"
import "../css/primary.css"

const manrope = Manrope({ 
	weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap'
});

export const metadata = {
	title: "MyNotes",
	description: "MyNotes",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<link rel="icon" href="/images/favicon.png" />
			<body className={manrope.className}>
				{children}
			</body>
		</html>
	);
}
