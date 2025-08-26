import { DashboardIcon, InventoryIcon, LogoutIcon, LogoIcon } from "./icons";


type SidebarProps = {
isCollapsed: boolean;
activePage: string;
setActivePage: (page: string) => void;
};


export default function Sidebar({ isCollapsed, activePage, setActivePage }: SidebarProps) {
const navLinkClasses = (page: string) =>
`nav-link flex items-center py-2.5 px-4 my-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${
isCollapsed ? "justify-center" : ""
} ${activePage === page ? "nav-link-active" : "text-gray-400"}`;


return (
<aside id="sidebar" className={`bg-gray-800 p-4 flex flex-col fixed h-full transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"}`}>
<div className={`logo-container flex items-center mb-8 flex-shrink-0 ${isCollapsed ? "justify-center" : ""}`}>
<LogoIcon />
{!isCollapsed && <span className="user-info text-xl font-bold text-white whitespace-nowrap">My App</span>}
</div>


<nav className="flex-grow">
<a href="#" onClick={(e) => { e.preventDefault(); setActivePage("dashboard"); }} className={navLinkClasses("dashboard")}>
<DashboardIcon />{!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
</a>
<a href="#" onClick={(e) => { e.preventDefault(); setActivePage("inventory"); }} className={navLinkClasses("inventory")}>
<InventoryIcon />{!isCollapsed && <span className="whitespace-nowrap">Inventory</span>}
</a>
</nav>


<div className="mt-auto flex-shrink-0">
<div className="pt-4 border-t border-gray-700">
<div className={`user-profile flex items-center ${isCollapsed ? "justify-center" : ""}`}>
<img className="w-10 h-10 rounded-full object-cover flex-shrink-0" src="https://placehold.co/100x100/2563eb/white?text=CU" alt="User Avatar" />
{!isCollapsed && (
<div className="user-info ml-3">
<p className="text-sm font-semibold text-white whitespace-nowrap">Current User</p>
<p className="text-xs text-gray-400 whitespace-nowrap">user@example.com</p>
</div>
)}
</div>
</div>
<a href="#" onClick={(e) => e.preventDefault()} className={navLinkClasses("logout")}>
<LogoutIcon />{!isCollapsed && <span className="whitespace-nowrap">Log Out</span>}
</a>
</div>
</aside>
);
}