import { I18nProvider } from "../locale/client";
import { Home } from "./home";

export default function App() {
	return (
		<I18nProvider>
			<Home />
		</I18nProvider>
	);
}
