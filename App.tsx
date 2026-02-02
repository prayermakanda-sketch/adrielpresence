
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, Layers, ShoppingBag, ArrowLeftRight, BrainCircuit,
  Plus, Search as SearchIcon, AlertTriangle, TrendingUp, X, Bell, Database,
  LayoutGrid, List, Columns, ImageIcon, Check, Send, ChevronRight,
  Save, ArrowUpRight, ArrowDownRight, Activity, Store, History,
  Scan, Filter, Settings, MoreVertical, LogIn, LogOut, PackageCheck,
  Tag, FolderOpen, MoreHorizontal, RefreshCw, Clock, ChevronLeft,
  ArrowRight, ClipboardList, Zap, MapPin, Truck, Laptop, Sofa, Speaker,
  Palette, Smartphone, Camera, Tv, Gamepad2, Heart, Dumbbell, Coffee, Music,
  FileText, Download, Calendar, DollarSign, ArrowUp, ArrowDown, ExternalLink,
  Table as TableIcon, SlidersHorizontal, ShieldCheck, Hash, Minus, ArrowRight as ArrowRightIcon,
  CircleDollarSign, AlertCircle, Globe, Link, Link2, Shield, Play
} from 'lucide-react';
import { InventoryItem, ActivityLog, TabType, ViewMode, ItemStatus, CategoryConfig } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const USD_TO_ZAR = 16.22;
const formatUSD = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatZAR = (val: number) => `R ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DEFAULT_CATEGORY_CONFIGS: CategoryConfig[] = [
  { id: '1', name: 'Computers & Tablets', icon: 'Laptop', color: 'blue', minThreshold: 5, dynamicFields: ['CPU Type', 'RAM', 'Storage'] },
  { id: '2', name: 'Cellphones & Wearables', icon: 'Smartphone', color: 'indigo', minThreshold: 8, dynamicFields: ['IMEI', 'Screen Size', 'Network'] },
  { id: '3', name: 'TV, Audio & Video', icon: 'Tv', color: 'purple', minThreshold: 3, dynamicFields: ['Resolution', 'Panel Type'] },
  { id: '4', name: 'Cameras', icon: 'Camera', color: 'rose', minThreshold: 2, dynamicFields: ['Sensor Type', 'Megapixels'] },
  { id: '5', name: 'Gaming', icon: 'Gamepad2', color: 'emerald', minThreshold: 10, dynamicFields: ['Platform', 'Region Code'] },
  { id: '6', name: 'Beauty', icon: 'Heart', color: 'pink', minThreshold: 15, dynamicFields: ['Volume', 'Ingredients'] },
  { id: '7', name: 'Home & Kitchen', icon: 'Coffee', color: 'orange', minThreshold: 5, dynamicFields: ['Wattage', 'Material'] },
  { id: '8', name: 'Sport & Training', icon: 'Dumbbell', color: 'cyan', minThreshold: 4, dynamicFields: ['Weight', 'Size'] },
  { id: '9', name: 'Musical Instruments', icon: 'Music', color: 'violet', minThreshold: 3, dynamicFields: ['Instrument Type', 'Brand', 'Condition'] }
];

const DualPriceDisplay = ({ usd, zar, className = "" }: { usd: number, zar: number, className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <span className="font-bold text-slate-900 leading-none tracking-tight">{formatUSD(usd)}</span>
    <span className="text-[10px] font-medium text-slate-400 mt-0.5">{formatZAR(zar)}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('kord_items_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('kord_logs_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toISOString());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    localStorage.setItem('kord_items_v2', JSON.stringify(items));
    localStorage.setItem('kord_logs_v2', JSON.stringify(logs));
  }, [items, logs]);

  const addLog = useCallback((itemId: string, itemName: string, type: ActivityLog['type'], delta: number, value: number, meta?: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      itemId, itemName, type, delta, value,
      timestamp: new Date().toISOString(),
      metadata: meta
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const handleAddItem = (newItem: Partial<InventoryItem>) => {
    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name || 'Unnamed Item',
      sku: newItem.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      serialNumber: newItem.serialNumber || '',
      warrantyExpiry: newItem.warrantyExpiry || '',
      quantity: newItem.quantity || 0,
      minThreshold: newItem.minThreshold || 5,
      price: newItem.price || 0,
      priceZar: (newItem.price || 0) * USD_TO_ZAR,
      category: newItem.category || 'General',
      lastUpdated: new Date().toISOString(),
      totalSold: 0,
      status: 'Available',
      images: [],
      customFields: [],
      attachments: []
    };
    setItems(prev => [...prev, item]);
    addLog(item.id, item.name, 'CREATE', item.quantity, item.quantity * item.price, "Initial Registration");
    setIsAddModalOpen(false);
  };

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    // Simulate real-time handshake with various marketplace APIs
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLastSync(new Date().toISOString());
    setIsSyncing(false);
    addLog('global', 'Marketplace Ecosystem', 'ADJUST', 0, 0, "Global synchronization with Takealot, Amazon, and eBay complete.");
  };

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen text-slate-900 selection:bg-blue-100 overflow-hidden">
      <aside className="w-72 border-r border-slate-100 flex flex-col sticky top-0 h-screen bg-white shadow-[30px_0_60px_-20px_rgba(0,0,0,0.03)] z-50">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3">
            <Zap className="text-white" size={24} fill="white" />
          </div>
          <div>
            <span className="font-black tracking-tight text-2xl text-slate-900 block leading-none">KORD</span>
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-1 block">Engine v2.4</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="pb-3 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Strategy</div>
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Operations" />
          <SidebarLink active={activeTab === 'items'} onClick={() => setActiveTab('items')} icon={<Layers size={20}/>} label="Registry" />
          <SidebarLink active={activeTab === 'marketplaces'} onClick={() => setActiveTab('marketplaces')} icon={<Globe size={20}/>} label="Marketplaces" />
          <SidebarLink active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<SlidersHorizontal size={20}/>} label="Deep Search" />
          
          <div className="pt-8 pb-3 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Logistics</div>
          <SidebarLink active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} icon={<ArrowLeftRight size={20}/>} label="Workflow Hub" />
          <SidebarLink active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<FileText size={20}/>} label="Intelligence" />
        </nav>

        <div className="p-8 border-t border-slate-50 space-y-4">
           <button 
             onClick={handleGlobalSync}
             disabled={isSyncing}
             className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border shadow-sm ${isSyncing ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-white border-blue-100 text-blue-600 hover:border-blue-400 active:scale-95'}`}
           >
             <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
             {isSyncing ? 'Synchronizing...' : 'Sync Ecosystem'}
           </button>
           <button onClick={() => setIsAddModalOpen(true)} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95">
             <Plus size={16}/> New Entry
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
        <header className="h-24 border-b border-slate-100 flex items-center justify-between px-12 bg-white/70 backdrop-blur-2xl sticky top-0 z-40">
           <div className="flex items-center gap-6 flex-1">
              <div className="relative w-full max-w-xl group">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" placeholder="Scan SKUs, Serial Numbers, or Assets..." 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-none rounded-[24px] text-sm font-semibold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                <span className="text-xs font-black text-emerald-500 flex items-center gap-1 justify-end"><Check size={12}/> Operational</span>
              </div>
              <button className="relative p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                <Bell size={22}/>
                <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
              </button>
              <div className="w-12 h-12 rounded-[20px] bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-xs">AD</div>
           </div>
        </header>

        <main className="p-12 max-w-[1600px] mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardOverview items={items} logs={logs} onInspect={setDetailItem} lastSync={lastSync} />}
          {activeTab === 'items' && (
            <ItemsRegistryView items={items} searchTerm={searchTerm} onInspect={setDetailItem} viewMode={viewMode} setViewMode={setViewMode} onBulkUpdate={setItems} />
          )}
          {activeTab === 'marketplaces' && <MarketplacesView items={items} isSyncing={isSyncing} onSync={handleGlobalSync} lastSync={lastSync} />}
          {activeTab === 'search' && (
            <AdvancedSearchView items={items} onInspect={setDetailItem} categoryConfigs={DEFAULT_CATEGORY_CONFIGS} />
          )}
          {activeTab === 'workflows' && (
            <WorkflowsView items={items} onLog={addLog} setItems={setItems} />
          )}
          {activeTab === 'reports' && (
            <ReportsView items={items} logs={logs} />
          )}
        </main>
      </div>

      {detailItem && <DetailPanel item={detailItem} logs={logs} onClose={() => setDetailItem(null)} />}
      {isAddModalOpen && <AddAssetModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddItem} configs={DEFAULT_CATEGORY_CONFIGS} />}
    </div>
  );
}

// --- VIEWS ---

const DashboardOverview = ({ items, logs, onInspect, lastSync }: any) => {
  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalValue = items.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0);
    const lowStockItems = items.filter((i: any) => i.quantity <= i.minThreshold);
    
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    let inflow = 0;
    let outflow = 0;
    
    logs.forEach((log: ActivityLog) => {
      const logDate = new Date(log.timestamp);
      if (logDate >= twentyFourHoursAgo) {
        if (log.delta > 0) inflow += log.delta;
        else if (log.delta < 0) outflow += Math.abs(log.delta);
      }
    });

    return { totalItems, totalValue, lowStockCount: lowStockItems.length, lowStockItems, inflow, outflow };
  }, [items, logs]);

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Header: Giant Stock Worth */}
      <div className="bg-slate-900 rounded-[60px] p-16 text-white relative overflow-hidden shadow-3xl shadow-blue-900/10 group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em]">Total Ecosystem Valuation</p>
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex flex-col">
                 <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none">{formatUSD(stats.totalValue)}</h1>
                 <div className="flex items-center gap-4 mt-4">
                    <p className="text-2xl md:text-3xl font-bold text-slate-400 tracking-tight">{formatZAR(stats.totalValue * USD_TO_ZAR)}</p>
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Live Market</div>
                 </div>
              </div>
           </div>
           <div className="flex gap-16 border-l border-slate-700/50 pl-16 h-full pb-2">
              <div className="text-right space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active SKUs</p>
                <p className="text-5xl font-black tracking-tighter">{stats.totalItems}</p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Restock Alerts</p>
                <p className="text-5xl font-black text-rose-400 tracking-tighter">{stats.lowStockCount}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SmallStatCard label="24h Inflow" value={stats.inflow > 0 ? `+${stats.inflow}` : 'No Volume'} icon={<ArrowUpRight size={20}/>} color="emerald" isPulse={stats.inflow > 0} />
        <SmallStatCard label="24h Outflow" value={stats.outflow > 0 ? `-${stats.outflow}` : 'No Volume'} icon={<ArrowDownRight size={20}/>} color="rose" isPulse={stats.outflow > 0} />
        <SmallStatCard label="Market Health" value="Strong" icon={<Globe size={20}/>} color="blue" subText={`Synced ${new Date(lastSync).toLocaleTimeString()}`} />
        <SmallStatCard label="Uptime" value="99.9%" icon={<Zap size={20}/>} color="amber" subText="Facility Link: Stable" />
      </div>

      {/* Critical Reorder Section */}
      {stats.lowStockItems.length > 0 && (
        <div className="bg-white border border-rose-100 rounded-[50px] p-12 space-y-10 shadow-2xl shadow-rose-500/5">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-rose-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-rose-200 animate-bounce-slow">
                    <AlertTriangle size={32} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Critical Restock Sequence</h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">{stats.lowStockCount} item nodes are below minimum safety thresholds.</p>
                 </div>
              </div>
              <button className="px-8 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Bulk Reorder</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {stats.lowStockItems.slice(0, 8).map((item: any) => (
                <div key={item.id} onClick={() => onInspect(item)} className="p-6 bg-rose-50/30 border border-rose-100 rounded-[32px] group hover:bg-rose-50 cursor-pointer transition-all flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                         {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-rose-200"/>}
                      </div>
                      <span className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-100">-{item.minThreshold - item.quantity}</span>
                   </div>
                   <p className="text-sm font-bold text-slate-900 truncate mb-1">{item.name}</p>
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{item.quantity} Units Left</p>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-12">
              <h3 className="font-bold text-2xl text-slate-900 flex items-center gap-3"><Activity size={24} className="text-blue-500"/> Performance Matrix</h3>
              <div className="flex gap-3 bg-slate-50 p-1.5 rounded-2xl">
                 {['1D', '1W', '1M', 'ALL'].map(t => <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${t === '1W' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>)}
              </div>
           </div>
           <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs.slice(0, 20).reverse()}>
                <defs><linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip 
                  cursor={{stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.12)', padding: '20px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={6} fill="url(#chartColor)" dot={false} activeDot={{ r: 10, strokeWidth: 0, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-2xl text-slate-900 flex items-center gap-3"><History size={24} className="text-slate-400"/> Event Feed</h3>
            <button className="text-blue-500 font-bold text-xs">View All</button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            {logs.slice(0, 12).map((log: any) => (
               <div key={log.id} className="p-5 bg-slate-50/50 rounded-3xl flex items-center justify-between group border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${['IN', 'CREATE'].includes(log.type) ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-600'}`}>
                      {['IN', 'CREATE'].includes(log.type) ? <ArrowUp size={18} strokeWidth={3}/> : <ArrowDown size={18} strokeWidth={3}/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate w-32 leading-none mb-1.5">{log.itemName}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{log.type}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                         <span className="text-[9px] font-medium text-slate-300">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-black tracking-tight ${['IN', 'CREATE'].includes(log.type) ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {log.delta > 0 ? '+' : ''}{log.delta}
                  </span>
               </div>
             ))}
             {logs.length === 0 && <div className="flex flex-col items-center justify-center h-full text-slate-300 italic text-sm">Waiting for telemetry...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketplacesView = ({ items, isSyncing, onSync, lastSync }: any) => {
  const PLATFORMS = [
    { name: 'Takealot', color: 'bg-blue-600', text: 'text-white', icon: <ShoppingBag size={24}/>, status: 'Active' },
    { name: 'Amazon', color: 'bg-orange-500', text: 'text-white', icon: <Store size={24}/>, status: 'Active' },
    { name: 'eBay', color: 'bg-emerald-600', text: 'text-white', icon: <Globe size={24}/>, status: 'Active' },
    { name: 'Shein', color: 'bg-black', text: 'text-white', icon: <PackageCheck size={24}/>, status: 'Active' }
  ];

  return (
    <div className="space-y-16 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Command Center</h1>
            <p className="text-slate-500 font-medium mt-2">Bi-directional marketplace synchronization.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Ecosystem Sync</p>
               <p className="text-xs font-bold text-slate-900">{new Date(lastSync).toLocaleString()}</p>
            </div>
            <button 
              onClick={onSync} 
              disabled={isSyncing}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3 active:scale-95 ${isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
            >
               {isSyncing ? <RefreshCw className="animate-spin" size={16}/> : <RefreshCw size={16}/>}
               {isSyncing ? 'Syncing Handshake' : 'Execute Global Sync'}
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-32 h-32 ${p.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`}></div>
               <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 ${p.color} ${p.text} rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform`}>{p.icon}</div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> {p.status}
                  </div>
               </div>
               <h3 className="text-2xl font-black text-slate-900">{p.name}</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">v4.2 API Linked</p>
               <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Listings</span>
                    <span className="text-lg font-black text-slate-900">42 Active</span>
                  </div>
                  <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-slate-900 hover:text-white transition-all"><ExternalLink size={16}/></button>
               </div>
            </div>
          ))}
       </div>

       <div className="bg-white rounded-[60px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-12 border-b border-slate-50 flex justify-between items-center">
             <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">Sync Integrity Log</h3>
             <div className="flex gap-4">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-all"><Filter size={14}/> Sort by Reliability</button>
             </div>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-12 py-6">Asset Name</th>
                    <th className="px-12 py-6">SKU / ID</th>
                    <th className="px-12 py-6">Pool Status</th>
                    <th className="px-12 py-6">Marketplace Price</th>
                    <th className="px-12 py-6 text-right">Drift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {items.slice(0, 10).map((item: any) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-12 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                                 {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-slate-200 mx-auto mt-3"/>}
                              </div>
                              <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                           </div>
                        </td>
                        <td className="px-12 py-6 font-mono text-xs text-slate-400">{item.sku}</td>
                        <td className="px-12 py-6">
                           <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black tracking-widest uppercase">Amazon Active</span>
                        </td>
                        <td className="px-12 py-6">
                           <DualPriceDisplay usd={item.price * 1.05} zar={item.priceZar * 1.05} />
                        </td>
                        <td className="px-12 py-6 text-right">
                           <span className="text-xs font-black text-emerald-500">+5.00%</span>
                        </td>
                     </tr>
                   ))}
                   {items.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"><Link2 size={32} className="text-slate-200" /></div>
                           <p className="text-slate-400 font-medium italic">No assets linked to external marketplaces.</p>
                        </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

// --- REFINED COMPONENTS ---

const SmallStatCard = ({ label, value, icon, color, isPulse, subText }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className={`w-16 h-16 bg-${color}-50 text-${color}-600 rounded-3xl flex items-center justify-center relative shadow-sm`}>
      {icon}
      {isPulse && <span className={`absolute -top-1 -right-1 w-4 h-4 bg-${color}-500 rounded-full animate-ping opacity-25`}></span>}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
      <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
      {subText && <p className="text-[9px] font-bold text-slate-300 uppercase mt-2 tracking-widest">{subText}</p>}
    </div>
  </div>
);

const SidebarLink = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[24px] text-sm font-bold transition-all relative ${active ? 'bg-slate-900 text-white shadow-2xl translate-x-2' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}>
    <span className={`${active ? 'text-blue-400' : 'text-slate-300'}`}>{icon}</span>
    <span className="tracking-tight">{label}</span>
    {active && <div className="absolute right-4 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>}
  </button>
);

const GridCard = ({ item, onInspect }: any) => {
  const isCritical = item.quantity <= item.minThreshold;
  return (
    <div 
      onClick={() => onInspect(item)} 
      className={`group bg-white rounded-[50px] border-2 overflow-hidden hover:shadow-3xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col p-8 shadow-sm relative ${isCritical ? 'border-rose-500' : 'border-slate-100'}`}
    >
      <div className={`aspect-square bg-slate-50 rounded-[40px] relative overflow-hidden flex items-center justify-center mb-8 shadow-inner ${isCritical ? 'bg-rose-50/50' : ''}`}>
        {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} /> : <ImageIcon className={isCritical ? 'text-rose-200' : 'text-slate-100'} size={64} strokeWidth={1}/>}
        <div className="absolute top-6 right-6">
          <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl ${isCritical ? 'bg-rose-600 text-white' : 'bg-white/95 text-slate-900'}`}>
            {item.quantity} Units
          </span>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2">
           <div className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur shadow-xl flex items-center justify-center text-blue-600"><ShoppingBag size={14}/></div>
           <div className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur shadow-xl flex items-center justify-center text-orange-500"><Store size={14}/></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-2">
        <h4 className={`font-black text-xl leading-none mb-3 truncate tracking-tight ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{item.name}</h4>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8">{item.sku}</p>
        <div className="mt-auto flex justify-between items-end pt-8 border-t border-slate-50">
          <DualPriceDisplay usd={item.price} zar={item.priceZar} />
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isCritical ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-900 text-white shadow-slate-200'}`}>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsRegistryView = ({ items, searchTerm, onInspect, viewMode, setViewMode, onBulkUpdate }: any) => {
  const filteredItems = useMemo(() => {
    return items.filter((i: any) => 
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.serialNumber && i.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Master Registry</h1>
          <p className="text-slate-500 font-medium mt-2">Comprehensive lifecycle tracking for all nodes.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
           <button onClick={() => setViewMode('grid')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={16}/> Grid</button>
           <button onClick={() => setViewMode('list')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><List size={16}/> List</button>
           <button onClick={() => setViewMode('spreadsheet')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'spreadsheet' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}><TableIcon size={16}/> Sheet</button>
        </div>
      </div>

      {viewMode === 'spreadsheet' ? (
        <SpreadsheetMode items={filteredItems} onBulkUpdate={onBulkUpdate} />
      ) : viewMode === 'list' ? (
        <div className="bg-white border border-slate-100 rounded-[60px] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-12 py-8">Asset Cluster</th>
                <th className="px-12 py-8">Reference ID</th>
                <th className="px-12 py-8">Operations Pool</th>
                <th className="px-12 py-8 text-right">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item: any) => {
                const isCritical = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors cursor-pointer relative ${isCritical ? 'bg-rose-50/10' : ''}`} onClick={() => onInspect(item)}>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        {isCritical && <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500 shadow-[4px_0_15px_rgba(244,63,94,0.4)] animate-pulse"></div>}
                        <div className={`w-14 h-14 bg-slate-50 rounded-[22px] flex items-center justify-center border-2 ${isCritical ? 'border-rose-100' : 'border-white shadow-sm'} overflow-hidden`}>
                          {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={20} className={isCritical ? 'text-rose-200' : 'text-slate-200'}/>}
                        </div>
                        <div>
                          <p className={`font-black text-base tracking-tight leading-none mb-2 ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{item.name}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold text-slate-500">{item.serialNumber || 'Unassigned'}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-1">{item.sku}</span>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-3">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                          {item.quantity} Units
                        </span>
                        {isCritical && <AlertCircle size={16} className="text-rose-500" />}
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right">
                      <DualPriceDisplay usd={item.price} zar={item.priceZar} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && <EmptyState />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map((item: any) => (
            <GridCard key={item.id} item={item} onInspect={onInspect} />
          ))}
          {filteredItems.length === 0 && <div className="col-span-full"><EmptyState /></div>}
        </div>
      )}
    </div>
  );
};

const SpreadsheetMode = ({ items, onBulkUpdate }: { items: InventoryItem[], onBulkUpdate: (i: InventoryItem[]) => void }) => {
  const [draft, setDraft] = useState<InventoryItem[]>(items);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => setDraft(items), [items]);

  const updateCell = (id: string, field: keyof InventoryItem, value: any) => {
    setDraft(prev => prev.map(item => {
      if (item.id === id) {
        setIsDirty(true);
        const updated = { ...item, [field]: value };
        if (field === 'price') updated.priceZar = (parseFloat(value) || 0) * USD_TO_ZAR;
        return updated;
      }
      return item;
    }));
  };

  const save = () => {
    onBulkUpdate(draft);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><TableIcon size={20}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Entry Matrix</p>
            <p className="text-xs font-bold text-slate-900 mt-1">Batch Modification Mode</p>
          </div>
        </div>
        {isDirty && (
          <button onClick={save} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3 animate-bounce-slow">
            <Save size={16}/> Commit Batch
          </button>
        )}
      </div>
      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left table-fixed min-w-[1400px]">
          <thead className="bg-slate-50/80">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="w-20 px-8 py-6">Img</th>
              <th className="w-72 px-8 py-6">Descriptor</th>
              <th className="w-48 px-8 py-6">SKU ID</th>
              <th className="w-48 px-8 py-6">Serial Registry</th>
              <th className="w-32 px-8 py-6">Inventory</th>
              <th className="w-40 px-8 py-6">Valuation ($)</th>
              <th className="w-48 px-8 py-6">Warranty Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {draft.map((item) => {
              const isCritical = item.quantity <= item.minThreshold;
              return (
                <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors ${isCritical ? 'bg-rose-50/30' : ''}`}>
                  <td className="px-8 py-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border-2 ${isCritical ? 'bg-rose-100 border-rose-200' : 'bg-slate-50 border-white shadow-sm'}`}>
                      {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={16} className={isCritical ? 'text-rose-300' : 'text-slate-200'}/>}
                    </div>
                  </td>
                  <td className="px-8 py-4"><input className={`w-full bg-transparent border-none font-black text-sm focus:ring-0 p-2 rounded hover:bg-slate-200/50 transition-all ${isCritical ? 'text-rose-600' : 'text-slate-900'}`} value={item.name} onChange={e => updateCell(item.id, 'name', e.target.value)}/></td>
                  <td className="px-8 py-4"><input className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-400 focus:ring-0 p-2 rounded hover:bg-slate-200/50" value={item.sku} onChange={e => updateCell(item.id, 'sku', e.target.value)}/></td>
                  <td className="px-8 py-4"><input className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-400 focus:ring-0 p-2 rounded hover:bg-slate-200/50" value={item.serialNumber} onChange={e => updateCell(item.id, 'serialNumber', e.target.value)}/></td>
                  <td className="px-8 py-4"><input type="number" className={`w-full bg-transparent border-none font-black text-sm focus:ring-0 text-center p-2 rounded hover:bg-rose-200/50 ${isCritical ? 'text-rose-600' : 'text-slate-900'}`} value={item.quantity} onChange={e => updateCell(item.id, 'quantity', parseInt(e.target.value) || 0)}/></td>
                  <td className="px-8 py-4"><input type="number" step="0.01" className="w-full bg-transparent border-none font-black text-sm text-slate-900 focus:ring-0 p-2 rounded hover:bg-slate-200/50" value={item.price} onChange={e => updateCell(item.id, 'price', parseFloat(e.target.value) || 0)}/></td>
                  <td className="px-8 py-4"><input type="date" className="w-full bg-transparent border-none text-[10px] font-black uppercase text-slate-400 focus:ring-0 p-2 rounded hover:bg-slate-200/50" value={item.warrantyExpiry} onChange={e => updateCell(item.id, 'warrantyExpiry', e.target.value)}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdvancedSearchView = ({ items, onInspect, categoryConfigs }: any) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceLimit, setPriceLimit] = useState(100000);
  const [dateFilter, setDateFilter] = useState<'any' | 'today' | 'week' | 'month'>('any');
  const [localSearch, setLocalSearch] = useState('');

  const filtered = useMemo(() => {
    return items.filter((i: any) => {
      const matchSearch = i.name.toLowerCase().includes(localSearch.toLowerCase()) || 
                          i.sku.toLowerCase().includes(localSearch.toLowerCase()) ||
                          (i.serialNumber && i.serialNumber.toLowerCase().includes(localSearch.toLowerCase()));
      const matchTag = selectedTags.length === 0 || selectedTags.includes(i.category);
      const matchPrice = i.price <= priceLimit;
      
      let matchDate = true;
      if (dateFilter !== 'any') {
        const itemDate = new Date(i.lastUpdated);
        const now = new Date();
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (dateFilter === 'today') matchDate = diffDays <= 1;
        else if (dateFilter === 'week') matchDate = diffDays <= 7;
        else if (dateFilter === 'month') matchDate = diffDays <= 30;
      }

      return matchSearch && matchTag && matchPrice && matchDate;
    });
  }, [items, localSearch, selectedTags, priceLimit, dateFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 animate-fade-in">
      <div className="lg:col-span-1 space-y-12">
        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm sticky top-32">
          <h2 className="text-xl font-black mb-10 flex items-center gap-3 text-slate-900 uppercase tracking-tight"><SlidersHorizontal size={24} className="text-blue-500"/> Tuning</h2>
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">Category Clusters</label>
              <div className="flex flex-wrap gap-2">
                {categoryConfigs.map((cat: any) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedTags(prev => prev.includes(cat.name) ? prev.filter(t => t !== cat.name) : [...prev, cat.name])}
                    className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${selectedTags.includes(cat.name) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Max Threshold</label>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{formatUSD(priceLimit)}</span>
              </div>
              <input type="range" min="0" max="100000" step="1000" value={priceLimit} onChange={e => setPriceLimit(parseInt(e.target.value))} className="w-full h-2 bg-slate-50 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-100" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">Temporal Filter</label>
              <div className="grid grid-cols-2 gap-3">
                {['any', 'today', 'week', 'month'].map((f: any) => (
                  <button key={f} onClick={() => setDateFilter(f)} className={`py-3 px-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border active:scale-95 ${dateFilter === f ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 text-center"><button onClick={() => { setSelectedTags([]); setPriceLimit(100000); setLocalSearch(''); setDateFilter('any'); }} className="text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-[0.2em]">Reset Parametrics</button></div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-12">
        <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="relative flex-1 max-w-xl group">
             <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input type="text" placeholder="Deep-scan asset metadata..." className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border-none rounded-[28px] text-base font-semibold focus:ring-4 focus:ring-blue-500/5 outline-none" value={localSearch} onChange={e => setLocalSearch(e.target.value)} />
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-6">{filtered.length} Indexed Nodes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
           {filtered.map((item: any) => (
             <GridCard key={item.id} item={item} onInspect={onInspect} />
           ))}
           {filtered.length === 0 && <div className="col-span-full py-48 text-center"><EmptyState /></div>}
        </div>
      </div>
    </div>
  );
};

const WorkflowsView = ({ items, onLog, setItems }: any) => {
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [amount, setAmount] = useState(1);
  const [mode, setMode] = useState<'ADD' | 'REMOVE' | 'MOVE'>('ADD');
  const [targetStatus, setTargetStatus] = useState<ItemStatus>('In Use');

  const confirm = () => {
    if (!selected) return;
    
    if (mode === 'REMOVE' && selected.quantity < amount) {
      return alert("Error: Insufficient stock levels.");
    }

    let change = 0;
    let meta = "";
    
    if (mode === 'ADD') {
      change = amount;
      meta = `Manual inventory addition (+${amount} units).`;
      setItems((prev: any) => prev.map((i: any) => i.id === selected.id ? { ...i, quantity: i.quantity + change, lastUpdated: new Date().toISOString() } : i));
    } else if (mode === 'REMOVE') {
      change = -amount;
      meta = `Manual inventory depletion (-${amount} units).`;
      setItems((prev: any) => prev.map((i: any) => i.id === selected.id ? { ...i, quantity: i.quantity + change, lastUpdated: new Date().toISOString() } : i));
    } else if (mode === 'MOVE') {
      meta = `Operational status transition: ${selected.status} → ${targetStatus}.`;
      setItems((prev: any) => prev.map((i: any) => i.id === selected.id ? { ...i, status: targetStatus, lastUpdated: new Date().toISOString() } : i));
    }

    onLog(selected.id, selected.name, mode === 'MOVE' ? 'STATUS_CHANGE' : (mode === 'ADD' ? 'IN' : 'OUT'), change, Math.abs(change) * selected.price, meta);
    
    setSelected(null);
    setAmount(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-fade-in py-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Workflow Hub</h1>
        <p className="text-slate-500 font-medium text-lg">Execute logistics sequences with zero latency.</p>
      </div>

      <div className="bg-white p-12 rounded-[70px] border border-slate-100 shadow-3xl space-y-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        {/* Large Thumb-Friendly Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
           <button 
             onClick={() => setMode('ADD')}
             className={`h-56 rounded-[50px] flex flex-col items-center justify-center gap-6 transition-all active:scale-95 ${mode === 'ADD' ? 'bg-emerald-600 text-white shadow-3xl shadow-emerald-200' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
           >
             <Plus size={64} strokeWidth={3} />
             <span className="font-black text-xs uppercase tracking-[0.4em]">Inflow (+)</span>
           </button>
           <button 
             onClick={() => setMode('REMOVE')}
             className={`h-56 rounded-[50px] flex flex-col items-center justify-center gap-6 transition-all active:scale-95 ${mode === 'REMOVE' ? 'bg-rose-600 text-white shadow-3xl shadow-rose-200' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
           >
             <Minus size={64} strokeWidth={3} />
             <span className="font-black text-xs uppercase tracking-[0.4em]">Outflow (-)</span>
           </button>
           <button 
             onClick={() => setMode('MOVE')}
             className={`h-56 rounded-[50px] flex flex-col items-center justify-center gap-6 transition-all active:scale-95 ${mode === 'MOVE' ? 'bg-blue-600 text-white shadow-3xl shadow-blue-200' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}
           >
             <ArrowRightIcon size={64} strokeWidth={3} />
             <span className="font-black text-xs uppercase tracking-[0.4em]">Status (→)</span>
           </button>
        </div>

        <div className="space-y-12">
           <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-10">Source Material Registry</label>
             <div className="relative">
                <Database className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                <select 
                  className="w-full bg-slate-50/80 border-none rounded-[40px] py-10 pl-24 pr-12 font-black text-2xl outline-none focus:ring-8 focus:ring-blue-500/5 appearance-none text-slate-900 shadow-inner cursor-pointer"
                  value={selected?.id || ''} 
                  onChange={e => setSelected(items.find((i: any) => i.id === e.target.value))}
                >
                  <option value="" disabled>Scanning for Asset Handshake...</option>
                  {items.map((i: any) => (
                    <option key={i.id} value={i.id}>
                      {i.name} — [{i.sku}]
                    </option>
                  ))}
                </select>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {mode !== 'MOVE' ? (
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-10">Unit Batch Amount</label>
                   <div className="flex items-center bg-slate-50 rounded-[40px] p-4 shadow-inner">
                      <button 
                        onClick={() => setAmount(Math.max(1, amount - 1))}
                        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform text-slate-900 font-black text-2xl"
                      >
                        <Minus size={24} strokeWidth={3}/>
                      </button>
                      <input 
                        type="number" 
                        className="flex-1 bg-transparent border-none text-center font-black text-5xl outline-none text-slate-900"
                        value={amount} 
                        onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))} 
                      />
                      <button 
                        onClick={() => setAmount(amount + 1)}
                        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform text-slate-900 font-black text-2xl"
                      >
                        <Plus size={24} strokeWidth={3}/>
                      </button>
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-10">Target Lifecycle State</label>
                   <div className="grid grid-cols-2 gap-4">
                      {['Available', 'To Repair', 'In Use', 'Sold'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setTargetStatus(status as ItemStatus)}
                          className={`py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all active:scale-95 ${targetStatus === status ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-100' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                   </div>
                </div>
              )}
              
              <div className="flex flex-col justify-end">
                 <button 
                   disabled={!selected}
                   onClick={confirm}
                   className={`w-full h-28 rounded-[40px] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 ${!selected ? 'bg-slate-50 text-slate-200 border border-slate-100' : 'bg-slate-900 text-white hover:bg-black shadow-3xl shadow-slate-200'}`}
                 >
                   Commit Sequence
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportsView = ({ items, logs }: any) => {
  const stats = useMemo(() => {
    const cats: any = {};
    items.forEach((i: any) => cats[i.category] = (cats[i.category] || 0) + (i.price * i.quantity));
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [items]);

  const COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

  return (
    <div className="space-y-16 animate-fade-in print:p-0">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 font-medium mt-2">Historical audit and distribution analytics.</p>
        </div>
        <button onClick={() => window.print()} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-3xl shadow-slate-200 flex items-center gap-3"><Download size={18} /> Export Data Set</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm">
            <h3 className="font-black text-2xl mb-12 text-slate-900 uppercase tracking-tight">Inventory Concentration</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '32px', border: 'none', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)', padding: '24px' }} 
                  />
                  <Bar dataKey="value" radius={[20, 20, 0, 0]}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm space-y-12">
            <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tight">Health KPI Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <ReportStatBox label="Registry Capacity" value={items.length} sub="Nodes Indexed" icon={<Layers className="text-blue-500"/>} />
               <ReportStatBox label="Telemetry Events" value={logs.length} sub="Total Logs" icon={<Activity className="text-emerald-500"/>} />
               <ReportStatBox label="Asset Velocity" value="+12%" sub="Weekly Drift" icon={<TrendingUp className="text-purple-500"/>} />
               <ReportStatBox label="Risk Factor" value={`${items.filter((i: any) => i.quantity <= i.minThreshold).length}`} sub="Critical Nodes" icon={<Shield className="text-rose-500"/>} />
            </div>
         </div>
      </div>

      <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-sm print:shadow-none print:border-none">
         <h3 className="font-black text-2xl mb-10 text-slate-900 uppercase tracking-tight">Full Strategic Register</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="py-6 px-4">Internal SKU</th>
                  <th className="py-6 px-4">Primary Descriptor</th>
                  <th className="py-6 px-4">Cluster</th>
                  <th className="py-6 px-4 text-right">Pool Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {items.map((i: any) => (
                  <tr key={i.id} className="text-sm">
                    <td className="py-6 px-4 text-slate-400 font-mono text-xs">{i.sku}</td>
                    <td className="py-6 px-4 font-black text-slate-900 text-base">{i.name}</td>
                    <td className="py-6 px-4">
                       <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{i.category}</span>
                    </td>
                    <td className="py-6 px-4 text-right font-black text-slate-900 text-base">{formatUSD(i.price * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const ReportStatBox = ({ label, value, sub, icon }: any) => (
  <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[40px] group hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:rotate-6 transition-transform">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">{sub}</p>
  </div>
);

const DetailPanel = ({ item, logs, onClose }: any) => {
  const itemLogs = useMemo(() => logs.filter((l: ActivityLog) => l.itemId === item.id), [logs, item.id]);
  const isCritical = item.quantity <= item.minThreshold;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white shadow-3xl animate-slide-left flex flex-col h-full rounded-l-[80px] border-l border-slate-100 overflow-hidden">
        <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-10 rounded-tl-[80px]">
           <div>
              <h3 className="font-black text-2xl text-slate-900 tracking-tight uppercase">Asset Specification</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">Registry Node: {item.id}</p>
           </div>
           <button onClick={onClose} className="w-16 h-16 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all active:scale-90"><X size={28}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar pb-48">
           {isCritical && (
             <div className="bg-rose-600 rounded-[40px] p-8 flex items-center gap-6 text-white shadow-3xl shadow-rose-200 animate-pulse">
               <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center"><AlertTriangle size={32} /></div>
               <div>
                 <p className="font-black text-sm uppercase tracking-[0.2em] mb-1">Stock Breach Protocol</p>
                 <p className="text-sm font-medium opacity-90 leading-snug">Safety threshold triggered. Automated restock sequence recommended.</p>
               </div>
             </div>
           )}

           <div className="flex flex-col items-center text-center space-y-10">
              <div className="w-80 h-80 bg-slate-50 rounded-[60px] border-4 border-white flex items-center justify-center shadow-3xl shadow-slate-200 overflow-hidden relative group">
                {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <ImageIcon size={100} className="text-slate-100" strokeWidth={1}/>}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                   <button className="opacity-0 group-hover:opacity-100 bg-white p-5 rounded-full shadow-2xl transition-all scale-75 group-hover:scale-100"><Camera size={24} className="text-slate-900"/></button>
                </div>
              </div>
              <div>
                <h2 className={`text-6xl font-black tracking-tighter leading-none mb-6 ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{item.name}</h2>
                <div className="flex justify-center flex-wrap gap-4">
                  <span className="px-6 py-2.5 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Hash size={12} strokeWidth={3}/> {item.serialNumber || 'N/A'}</span>
                  <span className="px-6 py-2.5 bg-blue-50 rounded-2xl text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Tag size={12} strokeWidth={3}/> {item.sku}</span>
                  <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-100 ${item.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.status}</span>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-10">
              <div className={`p-10 rounded-[50px] border-2 group hover:bg-white transition-all shadow-sm ${isCritical ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50/50 border-white'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Live Stock Level</p>
                <div className="flex items-baseline gap-2">
                   <p className={`text-6xl font-black tracking-tighter ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{item.quantity}</p>
                   <p className="text-sm font-bold text-slate-300">UNITS</p>
                </div>
              </div>
              <div className="p-10 bg-slate-50/50 rounded-[50px] border-2 border-white group hover:bg-white transition-all shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Pool Worth</p>
                <DualPriceDisplay usd={item.price} zar={item.priceZar} className="mt-2" />
                <p className="text-[10px] font-black text-slate-300 mt-4 uppercase tracking-[0.2em]">Based on index rate</p>
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6 flex items-center gap-3"><Clock size={16} /> Operations Audit History</h4>
              <div className="space-y-6 relative">
                 <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
                 {itemLogs.length > 0 ? itemLogs.map((log) => {
                   const isPositive = ['IN', 'CREATE'].includes(log.type);
                   return (
                     <div key={log.id} className="relative pl-20 group">
                        <div className={`absolute left-6 top-2 w-4 h-4 rounded-full border-4 border-white shadow-xl z-10 transition-transform group-hover:scale-125 ${isPositive ? 'bg-emerald-500' : log.type === 'ADJUST' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>
                        <div className="bg-slate-50/50 group-hover:bg-white group-hover:shadow-2xl border border-slate-100 rounded-[32px] p-8 transition-all duration-300">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-[0.1em]">{log.type.replace('_', ' ')}</span>
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</p>
                                 <p className="text-[9px] font-medium text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</p>
                              </div>
                           </div>
                           <p className="text-xs font-medium text-slate-500 italic mb-4 leading-relaxed">{log.metadata || 'System generated event log.'}</p>
                           <div className="flex items-center gap-4 pt-4 border-t border-slate-100/50">
                              <div className={`px-4 py-1 rounded-lg text-[10px] font-black ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {log.delta > 0 ? '+' : ''}{log.delta} Qty
                              </div>
                              <span className="text-xs font-black text-slate-900">{formatUSD(log.value)}</span>
                           </div>
                        </div>
                     </div>
                   );
                 }) : (
                   <div className="pl-20 py-10"><p className="text-sm font-medium text-slate-300 italic">No historical telemetry recorded for this node.</p></div>
                 )}
              </div>
           </div>
        </div>

        <div className="p-12 border-t border-slate-50 flex gap-6 bg-white/80 backdrop-blur-2xl rounded-bl-[80px] absolute bottom-0 left-0 right-0 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
           <button className="flex-1 py-6 bg-slate-900 text-white font-black rounded-3xl shadow-3xl shadow-slate-200 text-xs uppercase tracking-[0.3em] hover:bg-black transition-all active:scale-95">Adjust Node</button>
           <button className="flex-1 py-6 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-3xl text-xs uppercase tracking-[0.3em] hover:border-slate-300 transition-all active:scale-95">Edit Specification</button>
        </div>
      </div>
    </div>
  );
};

const AddAssetModal = ({ onClose, onSave, configs }: any) => {
  const [data, setData] = useState<Partial<InventoryItem>>({ name: '', price: 0, quantity: 0, category: configs[0]?.name || 'General', serialNumber: '', warrantyExpiry: '' });
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[80px] shadow-3xl overflow-hidden animate-fade-in border-4 border-white">
        <div className="p-16 border-b border-slate-50 flex justify-between items-center bg-white relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div>
             <h3 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Registry Handshake</h3>
             <p className="text-sm font-medium text-slate-400 mt-1">Initializing new asset specification node...</p>
          </div>
          <button onClick={onClose} className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded-3xl text-slate-400 hover:bg-slate-100 transition-all active:scale-90"><X size={28}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="p-16 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Primary Descriptor</label>
              <input required className="w-full bg-slate-50 border-none rounded-[32px] py-8 px-10 font-black text-xl outline-none focus:ring-8 focus:ring-blue-500/5 text-slate-900 shadow-inner" placeholder="e.g. Panasonic Lumix S5 Body" value={data.name} onChange={e=>setData({...data, name: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Registry ID (S/N)</label>
                 <input className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-10 font-bold text-sm outline-none text-slate-900 shadow-inner" placeholder="Serial Registry..." value={data.serialNumber} onChange={e=>setData({...data, serialNumber: e.target.value})} />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Warranty Expiry</label>
                 <input type="date" className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-10 font-bold text-sm outline-none text-slate-900 shadow-inner" value={data.warrantyExpiry} onChange={e=>setData({...data, warrantyExpiry: e.target.value})} />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Category Pool</label>
                 <div className="relative">
                    <select className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-10 font-bold text-sm outline-none text-slate-900 shadow-inner appearance-none cursor-pointer" value={data.category} onChange={e=>setData({...data, category: e.target.value})}>
                      {configs.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      <option value="General">General</option>
                    </select>
                    <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16}/>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Initial Balance</label>
                 <input type="number" className="w-full bg-slate-50 border-none rounded-[32px] py-6 px-10 font-black text-sm outline-none text-slate-900 shadow-inner" value={data.quantity} onChange={e=>setData({...data, quantity: parseInt(e.target.value)})} />
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-6">Unit Valuation (USD)</label>
              <div className="relative">
                 <DollarSign size={24} className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300" />
                 <input type="number" step="0.01" className="w-full bg-slate-50 border-none rounded-[32px] py-8 px-20 font-black text-3xl outline-none text-slate-900 shadow-inner" value={data.price} onChange={e=>setData({...data, price: parseFloat(e.target.value)})} />
              </div>
           </div>
           <button type="submit" className="w-full py-10 bg-slate-900 text-white font-black rounded-[40px] shadow-3xl shadow-slate-200 text-xs uppercase tracking-[0.4em] hover:bg-black transition-all active:scale-95">Execute Registration</button>
        </form>
      </div>
    </div>
  );
};

const ChevronDown = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const EmptyState = () => (
  <div className="py-48 text-center bg-white rounded-[60px] border border-slate-100">
    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><ClipboardList size={40} className="text-slate-200" /></div>
    <p className="text-slate-900 font-black uppercase tracking-[0.3em]">Registry Void</p>
    <p className="text-slate-400 text-base mt-2 font-medium italic">Initialize a new asset node to activate registry tracking.</p>
  </div>
);
