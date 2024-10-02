import "./App.css";
import Tokenizer from "./components/Tokenizer";

function App() {
	return (
		<div className="min-h-screen w-screen bg-white grid grid-cols-1 md:grid-cols-12">
			<div className="md:col-span-3">
				<div className="mt-20 mx-8 text-left space-y-4">
					<h1 className="text-4xl font-bold">Promptbuf</h1>
					<p className=" text-gray-400">Cheaper, lower latency prompts</p>
					<p className=" text-sm/6">
						Promptbuf is a JSON minifier that maintains semantic meaning. Built
						specifically for high-volume, low-latency prompt engineering.
					</p>
				</div>
			</div>
			<div className="md:col-span-9">
				<Tokenizer />
			</div>
		</div>
	);
}

export default App;
