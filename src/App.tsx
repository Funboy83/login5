import React, { useState, useEffect } from 'react';

// --- Type Definitions for our Data ---
type InventoryItem = {
    name: string; sku: string; price: string; stock: string; description: string;
    brand: string; color: string; gb: string; grade: string; carrier: string; battery: string;
};

// --- Helper SVG Icon Components ---
const LogoIcon = () => ( <svg className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> );
const DashboardIcon = () => ( <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> );
const InventoryIcon = () => ( <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> );
const LogoutIcon = () => ( <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> );
const MenuIcon = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> );

// --- Sidebar Component ---
type SidebarProps = { isCollapsed: boolean; activePage: string; setActivePage: (page: string) => void; };
function Sidebar({ isCollapsed, activePage, setActivePage }: SidebarProps) {
    const navLinkClasses = (page: string) => `nav-link flex items-center py-2.5 px-4 my-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''} ${activePage === page ? 'nav-link-active' : 'text-gray-400'}`;
    return (
        <aside id="sidebar" className={`bg-gray-800 p-4 flex flex-col fixed h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`logo-container flex items-center mb-8 flex-shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
                <LogoIcon />
                {!isCollapsed && <span className="user-info text-xl font-bold text-white whitespace-nowrap">My App</span>}
            </div>
            <nav className="flex-grow">
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }} className={navLinkClasses('dashboard')}><DashboardIcon />{!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('inventory'); }} className={navLinkClasses('inventory')}><InventoryIcon />{!isCollapsed && <span className="whitespace-nowrap">Inventory</span>}</a>
            </nav>
            <div className="mt-auto flex-shrink-0">
                <div className="pt-4 border-t border-gray-700">
                    <div className={`user-profile flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        <img className="w-10 h-10 rounded-full object-cover flex-shrink-0" src="https://placehold.co/100x100/2563eb/white?text=CU" alt="User Avatar" />
                        {!isCollapsed && (<div className="user-info ml-3"><p className="text-sm font-semibold text-white whitespace-nowrap">Current User</p><p className="text-xs text-gray-400 whitespace-nowrap">user@example.com</p></div>)}
                    </div>
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} className={navLinkClasses('logout')}><LogoutIcon />{!isCollapsed && <span className="whitespace-nowrap">Log Out</span>}</a>
            </div>
        </aside>
    );
}

// --- Page Components ---
function Dashboard() {
    return ( <div className="animate-fadeIn"><h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2><p>Welcome to your dashboard. Here's a summary of your application.</p></div> );
}

function Inventory() {
    const [activeTab, setActiveTab] = useState('search');
    const [formData, setFormData] = useState<InventoryItem>({ name: '', sku: '', price: '', stock: '', description: '', brand: '', color: '', gb: '', grade: '', carrier: '', battery: '' });
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [brandOptions, setBrandOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddingBrand, setIsAddingBrand] = useState(false);
    const [newBrandValue, setNewBrandValue] = useState("");

    const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbwaslPDu2h5iEm58-39f7cmpn3s-gnVYE248AmhO1XtTPQeTU7SGoDRvLzg5ZHinoCg/exec";

    const fetchBrands = async () => {
        const response = await fetch(`${SPREADSHEET_URL}?action=getBrandOptions`);
        const data = await response.json();
        if (data && Array.isArray(data.options)) {
            setBrandOptions(data.options);
        } else {
            console.warn("Brand data not in expected format", data);
        }
    };

    useEffect(() => {
        const fetchInventory = fetch(SPREADSHEET_URL).then(res => res.json());
        Promise.all([fetchInventory, fetchBrands()])
            .then(([inventoryData]) => {
                if (inventoryData && Array.isArray(inventoryData.items)) {
                    const formattedData = inventoryData.items.map((item: any) => ({ name: item.Model || 'N/A', sku: item.Imei || `temp-sku-${Math.random()}`, price: String(item.Price) || '0', stock: item.Imei ? '1' : '0', description: `${item.Brand || ''} ${item.Color || ''} ${item.GB || ''}GB - Grade: ${item.Grade || 'N/A'}`, brand: item.Brand || '', color: item.Color || '', gb: String(item.GB) || '', grade: item.Grade || '', carrier: item.Carrier || '', battery: String(item.Battery) || '' }));
                    setInventoryItems(formattedData);
                } else { throw new Error("Inventory data is not in the expected format"); }
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                setError("Failed to load data. Please check the script URL and permissions.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleEditClick = (item: InventoryItem) => { setFormData(item); setActiveTab('add'); };

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'add_new') {
            setIsAddingBrand(true);
        } else {
            setFormData({ ...formData, brand: e.target.value });
        }
    };

    const handleSaveNewBrand = () => {
        if (!newBrandValue.trim()) return; // Prevent saving empty brand
        fetch(SPREADSHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for simple Google Script POSTs
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newBrand: newBrandValue })
        }).then(() => {
            // Optimistically update UI
            const updatedBrands = [...brandOptions, newBrandValue].sort();
            setBrandOptions(updatedBrands);
            setFormData({ ...formData, brand: newBrandValue });
            setNewBrandValue("");
            setIsAddingBrand(false);
        }).catch(err => console.error("Failed to save new brand", err));
    };

    const renderContent = () => {
        if (isLoading) return <p>Loading inventory...</p>;
        if (error) return <p className="text-red-400">{error}</p>;
        if (inventoryItems.length === 0) return <p>No inventory items found.</p>;
        return (
            <table className="min-w-full border-collapse">
                <thead><tr>{[ 'Brand', 'Model', 'SKU (IMEI)', 'Color', 'GB', 'Grade', 'Carrier', 'Battery', 'Price', 'Actions'].map(h => <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border border-gray-600 bg-gray-700">{h}</th>)}</tr></thead>
                <tbody>{inventoryItems.map((item, index) => (<tr key={item.sku || index}><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.brand}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.name}</td><td className="py-4 px-4 whitespace-nowrap text-gray-400 border border-gray-600">{item.sku}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.color}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.gb}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.grade}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.carrier}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.battery ? `${item.battery}%` : ''}</td><td className="py-4 px-4 whitespace-nowrap text-gray-400 border border-gray-600">${item.price}</td><td className="py-4 px-4 whitespace-nowrap border border-gray-600"><button onClick={() => handleEditClick(item)} className="text-blue-400 hover:underline">Edit</button></td></tr>))}</tbody>
            </table>
        );
    };

    return (
        <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white">Inventory</h2>
            <div className="flex border-b border-gray-700">
                <button onClick={() => setActiveTab('search')} className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'search' ? 'text-blue-500 border-blue-500' : 'text-gray-300 border-transparent hover:border-blue-500 hover:text-white'}`}>Search Items</button>
                <button onClick={() => { setActiveTab('add'); setFormData({ name: '', sku: '', price: '', stock: '', description: '', brand: '', color: '', gb: '', grade: '', carrier: '', battery: '' }); }} className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-300 ${activeTab === 'add' ? 'text-blue-500 border-blue-500' : 'text-gray-300 border-transparent hover:border-blue-500 hover:text-white'}`}>Add Item</button>
            </div>
            <div className="bg-gray-800 rounded-b-lg border-x border-b border-gray-700 p-6">
                {activeTab === 'search' && <div className="overflow-x-auto">{renderContent()}</div>}
                {activeTab === 'add' && (
                     <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                                {!isAddingBrand ? (
                                    <select id="brand" value={formData.brand} onChange={handleBrandChange} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select a Brand</option>
                                        {brandOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                        <option value="add_new" className="text-blue-400 font-semibold">-- Add New Brand --</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <input type="text" value={newBrandValue} onChange={e => setNewBrandValue(e.target.value)} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Brand Name" />
                                        <button type="button" onClick={handleSaveNewBrand} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300">Save</button>
                                        <button type="button" onClick={() => setIsAddingBrand(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300">X</button>
                                    </div>
                                )}
                             </div>
                             <div><label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-1">Model (Name)*</label><input type="text" id="productName" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="itemCode" className="block text-sm font-medium text-gray-300 mb-1">IMEI (SKU)*</label><input type="text" id="itemCode" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-1">Color</label><input type="text" id="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="gb" className="block text-sm font-medium text-gray-300 mb-1">GB</label><input type="text" id="gb" value={formData.gb} onChange={e => setFormData({...formData, gb: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="grade" className="block text-sm font-medium text-gray-300 mb-1">Grade</label><input type="text" id="grade" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="carrier" className="block text-sm font-medium text-gray-300 mb-1">Carrier</label><input type="text" id="carrier" value={formData.carrier} onChange={e => setFormData({...formData, carrier: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="battery" className="block text-sm font-medium text-gray-300 mb-1">Battery %</label><input type="text" id="battery" value={formData.battery} onChange={e => setFormData({...formData, battery: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                             <div><label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price*</label><input type="text" id="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                                Save Product
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// --- Main App Component ---
export default function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const renderActivePage = () => {
        switch (activePage) {
            case 'inventory': return <Inventory />;
            case 'dashboard': 
            default: 
                return <Dashboard />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-200 flex min-h-screen">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                activePage={activePage} 
                setActivePage={setActivePage} 
            />
            <main 
                id="main-content" 
                className={`flex-1 p-6 sm:p-8 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="text-gray-400 hover:text-white mb-4">
                    <MenuIcon />
                </button>
                {renderActivePage()}
            </main>
        </div>
    );
}
