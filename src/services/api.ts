const SPREADSHEET_URL = import.meta.env.VITE_SCRIPT_URL || "<PASTE_YOUR_GAS_EXEC_URL_HERE>";
const API_KEY = import.meta.env.VITE_API_KEY || ""; // optional simple protection


async function json<T>(res: Response): Promise<T> {
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return res.json() as Promise<T>;
}


export async function getInventory(): Promise<{ items: any[] }> {
const res = await fetch(`${SPREADSHEET_URL}`);
return json(res);
}


export async function getBrandOptions(): Promise<{ options: string[] }> {
const res = await fetch(`${SPREADSHEET_URL}?action=getBrandOptions`);
return json(res);
}


export async function addBrand(newBrand: string): Promise<void> {
// If your GAS doesn’t return CORS headers, you can’t read the response.
// We post and optimistically update the UI.
await fetch(`${SPREADSHEET_URL}`, {
method: "POST",
mode: "no-cors",
headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
body: JSON.stringify({ newBrand })
});
}


export async function addItem(payload: Record<string, string>): Promise<void> {
await fetch(`${SPREADSHEET_URL}`, {
method: "POST",
mode: "no-cors",
headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
body: JSON.stringify({ action: "addItem", ...payload })
});
}