import "./App.css";
import GithubIcon from "./assets/github.svg";
import NpmIcon from "./assets/npm.svg";
import PythonIcon from "./assets/python.svg";

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
					<div className="inline-flex space-x-4">
						<a
							href="https://github.com/Tetra-Research/promptbuf"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="w-8 h-8" src={GithubIcon} alt="Github Icon" />
						</a>
						<a
							href="https://pypi.org/project/promptbuf/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="w-8 h-8" src={PythonIcon} alt="Pypi Icon" />
						</a>
						<a
							href="https://www.npmjs.com/package/promptbuf"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="w-8 h-8" src={NpmIcon} alt="NPM Icon" />
						</a>
					</div>
				</div>
			</div>
			<div className="md:col-span-9">
				<Tokenizer />
			</div>
		</div>
	);
}

export default App;
