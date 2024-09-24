interface MyModule extends EmscriptenModule {
	ccall: typeof ccall;
	cwrap: typeof cwrap;
}

declare function require(module: string): any;

class MyCppLib {
	private module: MyModule;

	constructor() {
		this.module = require("../wasm/binding.wasm");
	}

	async initialize(): Promise<void> {
		await this.module.ready;
	}

	add(a: number, b: number): number {
		return this.module.ccall("add", "number", ["number", "number"], [a, b]);
	}
}

export default MyCppLib;
