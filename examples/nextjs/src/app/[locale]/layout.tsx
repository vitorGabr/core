import { Providers } from "./providers";

export default function LocaleLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Providers>
			{children}
		</Providers>
	);
}
