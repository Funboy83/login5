import { useEffect, useState } from "react";
import type { InventoryItem } from "../types";
import { addBrand, addItem, getBrandOptions, getInventory } from "../services/api";


export default function Inventory() {
const [activeTab, setActiveTab] = useState("search");
const [formData, setFormData] = useState<InventoryItem>({
name: "", sku: "", price: "", stock: "", description: "",
brand: "", color: "", gb: "", grade: "", carrier: "", battery: "",
});
const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
const [brandOptions, setBrandOptions] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isAddingBrand, setIsAddingBrand] = useState(false);
const [newBrandValue, setNewBrandValue] = useState("");


useEffect(() => {
const load = async () => {
try {
const [inventoryData, brandData] = await Promise.all([
getInventory(),
getBrandOptions(),
]);
if (Array.isArray(inventoryData.items)) {
const formatted = inventoryData.items.map((item: any) => ({
name: item.Model || "N/A",
sku: item.Imei || `temp-sku-${Math.random()}`,
price: String(item.Price ?? "0"),
stock: item.Imei ? "1" : "0",
description: `${item.Brand || ""} ${item.Color || ""} ${item.GB || ""}GB - Grade: ${item.Grade || "N/A"}`,
brand: item.Brand || "",
color: item.Color || "",
gb: String(item.GB ?? ""),
grade: item.Grade || "",
carrier: item.Carrier || "",
battery: String(item.Battery ?? ""),
}));
setInventoryItems(formatted);
} else {
throw new Error("Inventory data not array");
}


if (Array.isArray(brandData.options)) setBrandOptions(brandData.options);
} catch (err: any) {
console.error(err);
setError("Failed to load data. Check script URL and permissions.");
} finally {
setIsLoading(false);
}
};
load();
}, []);

const handleEditClick = (item: InventoryItem) => {
setFormData(item);
setActiveTab("add");
};


const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
if (e.target.value === "add_new") setIsAddingBrand(true);
else setFormData({ ...formData, brand: e.target.value });
};


const handleSaveNewBrand = async () => {
const v = newBrandValue.trim();
if (!v) return;
try {
await addBrand(v); // may be no-cors; UI is optimistic
const updated = [...brandOptions, v].sort();
setBrandOptions(updated);
setFormData({ ...formData, brand: v });
setNewBrandValue("");
setIsAddingBrand(false);
} catch (err) {
console.error("Failed to save new brand", err);
}
};


const handleSaveItem = async (e: React.FormEvent) => {
e.preventDefault();


// Minimal validation
if (!formData.name.trim() || !formData.sku.trim() || !formData.price.trim()) {
alert("Model, IMEI and Price are required.");
return;
}

const payload = {
Model: formData.name,
Imei: formData.sku,
Price: formData.price,
Color: formData.color,
GB: formData.gb,
Grade: formData.grade,
Carrier: formData.carrier,
Battery: formData.battery,
Brand: formData.brand,
} as Record<string, string>;


try {
await addItem(payload); // may be no-cors
alert("Saved!");
setActiveTab("search");
} catch (err) {
console.error(err);
alert("Save failed. Check console.");
}
};
const renderTable = () => {
if (isLoading) return <p>Loading inventory...</p>;
if (error) return <p className="text-red-400">{error}</p>;
if (!inventoryItems.length) return <p>No inventory items found.</p>;


const headers = ["Brand", "Model", "SKU (IMEI)", "Color", "GB", "Grade", "Carrier", "Battery", "Price", "Actions"];
return (
<table className="min-w-full border-collapse">
<thead>
<tr>
{headers.map((h) => (
<th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border border-gray-600 bg-gray-700">{h}</th>
))}
</tr>
</thead>
<tbody>
{inventoryItems.map((item, idx) => (
<tr key={item.sku || idx}>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.brand}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.name}</td>
<td className="py-4 px-4 whitespace-nowrap text-gray-400 border border-gray-600">{item.sku}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.color}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.gb}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.grade}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.carrier}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">{item.battery ? `${item.battery}%` : ""}</td>
<td className="py-4 px-4 whitespace-nowrap text-gray-400 border border-gray-600">${item.price}</td>
<td className="py-4 px-4 whitespace-nowrap border border-gray-600">
<button onClick={() => handleEditClick(item)} className="text-blue-400 hover:underline">Edit</button>
</td>
</tr>
))}
</tbody>
</table>
);
};
return (
<div className="animate-fadeIn">
<h2 className="text-3xl font-bold mb-6 text-white">Inventory</h2>


<div className="flex border-b border-gray-700">
<button onClick={() => setActiveTab("search")} className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-300 ${activeTab === "search" ? "text-blue-500 border-blue-500" : "text-gray-300 border-transparent hover:border-blue-500 hover:text-white"}`}>Search Items</button>
<button onClick={() => { setActiveTab("add"); setFormData({ name: "", sku: "", price: "", stock: "", description: "", brand: "", color: "", gb: "", grade: "", carrier: "", battery: "" }); }} className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-300 ${activeTab === "add" ? "text-blue-500 border-blue-500" : "text-gray-300 border-transparent hover:border-blue-500 hover:text-white"}`}>Add Item</button>
</div>


<div className="bg-gray-800 rounded-b-lg border-x border-b border-gray-700 p-6">
{activeTab === "search" && <div className="overflow-x-auto">{renderTable()}</div>}


{activeTab === "add" && (
<form className="space-y-6" onSubmit={handleSaveItem}>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
{!isAddingBrand ? (
<select id="brand" value={formData.brand} onChange={handleBrandChange} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
<option value="">Select a Brand</option>
{brandOptions.map((o) => (
<option key={o} value={o}>{o}</option>
))}
<option value="add_new" className="text-blue-400 font-semibold">-- Add New Brand --</option>
</select>
) : (
<div className="flex items-center space-x-2">
<input type="text" value={newBrandValue} onChange={(e) => setNewBrandValue(e.target.value)} className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New Brand Name" />
<button type="button" onClick={handleSaveNewBrand} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300">Save</button>
<button type="button" onClick={() => setIsAddingBrand(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300">X</button>
</div>
)}
</div>


{/* Other inputs */}
{([
["Model (Name)*", "name", "text"],
["IMEI (SKU)*", "sku", "text"],
["Color", "color", "text"],
["GB", "gb", "text"],
["Grade", "grade", "text"],
["Carrier", "carrier", "text"],
["Battery %", "battery", "text"],
["Price*", "price", "text"],
] as const).map(([label, key, type]) => (
<div key={key}>
<label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
<input
type={type}
value={(formData as any)[key]}
onChange={(e) => setFormData({ ...formData, [key]: e.target.value } as InventoryItem)}
className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
))}
</div>


<div className="flex justify-end pt-4">
<button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">Save Product</button>
</div>
</form>
)}
</div>
</div>
);
}