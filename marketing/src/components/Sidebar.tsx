function Sidebar() {
	return (
		<aside className="w-full lg:w-96 lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:overflow-y-auto lg:bg-gray-900 p-6">
			{/* <Logo /> */}
			Logo
			<h1 className="mt-10 text-4xl font-bold">Commit</h1>
			<p className="mt-4 text-gray-400">
				Open-source Git client for macOS minimalists
			</p>
			<nav className="mt-10">{/* Add navigation links here */}</nav>
		</aside>
	);
}

export default Sidebar;
