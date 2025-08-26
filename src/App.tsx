import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import { MenuIcon } from "./components/icons";


export default function App() {
const [activePage, setActivePage] = useState("dashboard");
const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);


const renderActive = () => (activePage === "inventory" ? <Inventory /> : <Dashboard />);


return (
<div className="bg-gray-900 text-gray-200 flex min-h-screen">
<Sidebar isCollapsed={isSidebarCollapsed} activePage={activePage} setActivePage={setActivePage} />
<main id="main-content" className={`flex-1 p-6 sm:p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
<button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="text-gray-400 hover:text-white mb-4">
<MenuIcon />
</button>
{renderActive()}
</main>
</div>
);
}