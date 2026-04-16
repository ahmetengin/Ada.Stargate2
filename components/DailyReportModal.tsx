
import React from 'react';
import { X, Printer, ShieldAlert, Anchor, Briefcase, Sun, Wind, CloudRain, Utensils, ShoppingBag, Activity, AlertTriangle, Navigation, DollarSign, FileText } from 'lucide-react';
import { RegistryEntry, UserProfile, WeatherForecast, TenantConfig } from '../types';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  registry: RegistryEntry[];
  logs: any[];
  vesselsInPort: number;
  userProfile: UserProfile;
  weatherData: WeatherForecast[];
  activeTenantConfig: TenantConfig;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({ 
  isOpen, 
  onClose, 
  registry, 
  logs, 
  vesselsInPort,
  userProfile,
  weatherData,
  activeTenantConfig
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const currentWx = weatherData[0] || { temp: 24, condition: 'Sunny', windSpeed: 12, windDir: 'NW' };

  const handlePrint = () => {
    window.print();
  };

  // --- 1. GUEST UI (Lifestyle & Tourism) ---
  const GuestDashboard = () => (
    <div className="space-y-6 text-zinc-800 dark:text-zinc-200">
        {/* Welcome Header */}
        <div className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h2 className="text-2xl font-serif italic text-zinc-600 dark:text-zinc-400">Good Morning,</h2>
            <h1 className="text-4xl font-bold tracking-tight mt-2 text-indigo-600 dark:text-indigo-400">{userProfile.name}</h1>
            <p className="text-sm uppercase tracking-widest mt-3 text-zinc-400">{today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 flex items-center justify-between shadow-sm border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-indigo-900/50 rounded-full shadow-md text-yellow-500">
                    {currentWx.condition === 'Rain' ? <CloudRain size={32} /> : <Sun size={32} />}
                </div>
                <div>
                    <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{currentWx.temp}°C</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{currentWx.condition}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-zinc-600 dark:text-zinc-300 text-sm mb-1">
                    <Wind size={16} /> {currentWx.windSpeed} knots
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">Perfect for sailing</div>
            </div>
        </div>

        {/* Marina Pulse */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">MARINA GUESTS</div>
                <div className="text-2xl font-mono font-bold text-zinc-800 dark:text-zinc-200">{vesselsInPort} <span className="text-sm font-sans font-normal text-zinc-500">Yachts</span></div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">VIBE</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">Relaxing</span>
                </div>
            </div>
        </div>

        {/* Amenities */}
        <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Today at {activeTenantConfig.name}</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Utensils size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">Kumsal Istanbul Street</div>
                        <div className="text-xs text-zinc-500">Open until 00:00 • International Cuisine</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBag size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">Yacht Market & Boutique</div>
                        <div className="text-xs text-zinc-500">New summer collection arrived</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">West Life Sports Club</div>
                        <div className="text-xs text-zinc-500">Yoga session at 10:00 AM</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // --- 2. CAPTAIN UI (Navigation & Safety) ---
  const CaptainDashboard = () => {
      const navAlerts = logs.filter(log => 
          (log.type === 'ENVIRONMENTAL_ALERT' || log.type === 'atc_log' || log.source.includes('weather')) 
      );

      return (
        <div className="space-y-6 font-mono text-zinc-800 dark:text-zinc-300">
            {/* Nav Header */}
            <div className="bg-amber-500 text-black p-4 -mx-6 -mt-6 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldAlert size={24} />
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-widest">Notice to Mariners</h2>
                        <div className="text-xs opacity-80">{today.toUTCString()}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold">SEC: {activeTenantConfig.region || 'MARMARA'}</div>
                    <div className="text-xs">{activeTenantConfig.name} APPROACH</div>
                </div>
            </div>

            {/* MetOcean Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="text-[10px] text-zinc-500 uppercase">Wind</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{currentWx.windSpeed} <span className="text-xs">kn</span></div>
                    <div className="text-xs font-bold text-zinc-500">{currentWx.windDir}</div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="text-[10px] text-zinc-500 uppercase">Vis</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">10+ <span className="text-xs">nm</span></div>
                    <div className="text-xs font-bold text-zinc-500">GOOD</div>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="text-[10px] text-zinc-500 uppercase">QNH</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">1013</div>
                    <div className="text-xs font-bold text-zinc-500">hPa</div>
                </div>
            </div>

            {/* Active Alerts List */}
            <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-3 border-b border-amber-500/30 pb-1">
                    <AlertTriangle size={14} />
                    Active Warnings
                </h3>
                <div className="space-y-2">
                    {navAlerts.length > 0 ? navAlerts.slice(0,4).map((log, i) => (
                        <div key={i} className="flex gap-3 text-xs bg-amber-50 dark:bg-amber-900/10 p-2 rounded border-l-2 border-amber-500">
                            <span className="font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">{log.timestamp}</span>
                            <span className="text-zinc-700 dark:text-zinc-300">{typeof log.message === 'string' ? log.message : 'Navigation Notice'}</span>
                        </div>
                    )) : (
                        <div className="text-xs text-zinc-500 italic py-2">No active navigational warnings in {activeTenantConfig.name} sector.</div>
                    )}
                </div>
            </div>

            {/* Traffic Status */}
            <div className="bg-zinc-900 text-zinc-300 p-4 rounded-lg text-xs">
                <div className="flex justify-between mb-2">
                    <span className="text-zinc-500">SECTOR CONTROL</span>
                    <span className="text-emerald-400 font-bold">OPEN</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-zinc-500">VTS CHANNEL</span>
                    <span className="font-mono">12 / 16</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">MARINA OPS</span>
                    <span className="font-mono">72</span>
                </div>
            </div>
        </div>
      );
  }

  // --- 3. GENERAL MANAGER UI (Ops & Finance) ---
  const GMDashboard = () => {
    const criticalLogs = logs.filter(log => log.type === 'critical' || log.type === 'alert');
    
    return (
        <div className="space-y-6 text-zinc-800 dark:text-zinc-200 font-sans">
             {/* Executive Header */}
             <div className="flex items-center justify-between border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Executive Operations</h2>
                    <div className="text-[10px] font-mono text-zinc-500 mt-1">CONFIDENTIAL • EYES ONLY</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold bg-zinc-900 text-white px-2 py-1 rounded">GM: {userProfile.name}</div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <Anchor size={14} />
                        <span className="text-[10px] uppercase font-bold">Occupancy</span>
                    </div>
                    <div className="text-2xl font-bold">{vesselsInPort} <span className="text-sm font-normal text-zinc-400">/ 600</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ 4% vs last week</div>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <Navigation size={14} />
                        <span className="text-[10px] uppercase font-bold">Movements</span>
                    </div>
                    <div className="text-2xl font-bold">{registry.length}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Today's traffic</div>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <DollarSign size={14} />
                        <span className="text-[10px] uppercase font-bold">Revenue (Est)</span>
                    </div>
                    <div className="text-2xl font-bold">€{(vesselsInPort * 1.5 * 100).toFixed(0)}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Daily Mooring Accrual</div>
                </div>
            </div>

            {/* Critical Issues */}
            <div>
                <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">Critical Incidents</h3>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg overflow-hidden">
                    {criticalLogs.length > 0 ? (
                        <table className="w-full text-xs text-left">
                            <thead className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                                <tr>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Source</th>
                                    <th className="p-2">Event</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-100 dark:divide-red-900/30">
                                {criticalLogs.slice(0,5).map((log, i) => (
                                    <tr key={i}>
                                        <td className="p-2 font-mono text-zinc-500">{log.timestamp}</td>
                                        <td className="p-2 font-bold text-red-700 dark:text-red-400">{log.source}</td>
                                        <td className="p-2">{typeof log.message === 'string' ? log.message : 'System Alert'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-4 text-center text-zinc-500 text-sm">System Green. No critical anomalies.</div>
                    )}
                </div>
            </div>

            {/* Financial Overview */}
            <div>
                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
                    Financial Overview
                </h3>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg text-xs space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Overdue Accounts</span>
                        <span className="font-bold text-amber-500">2 Vessels</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Total Receivables</span>
                        <span className="font-mono font-bold">€850.00</span>
                     </div>
                </div>
            </div>

             {/* Technical Ops */}
            <div>
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
                    Technical Ops
                </h3>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg text-xs space-y-2">
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Active Jobs</span>
                        <span className="font-bold">3</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Waiting for Parts</span>
                        <span className="font-mono font-bold text-amber-500">1</span>
                     </div>
                </div>
            </div>
        </div>
    );
  }

  const renderContent = () => {
    switch(userProfile.role) {
      case 'GUEST': return <GuestDashboard />;
      case 'CAPTAIN': return <CaptainDashboard />;
      case 'GENERAL_MANAGER': return <GMDashboard />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
             <FileText size={16} className="text-indigo-500" />
             <h2 className="font-bold text-zinc-800 dark:text-zinc-200">{activeTenantConfig.name} Daily Operations Report</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint} 
              className="p-2 rounded-md text-zinc-500 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Print Report"
            >
              <Printer size={16} />
            </button>
            <button onClick={onClose} className="p-2 rounded-md text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X size={16} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" id="printable-report">
            {renderContent()}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .dark {
             color-scheme: light; /* Force light mode for printing */
          }
          #printable-report.dark, .dark #printable-report {
            background-color: white !important;
            color: black !important;
          }
          .dark #printable-report [class*="dark:text-"] {
             color: inherit !important;
          }
           .dark #printable-report [class*="dark:bg-"] {
             background-color: #f4f4f5 !important;
          }
           .dark #printable-report [class*="dark:border-"] {
             border-color: #e4e4e7 !important;
          }
        }
      `}</style>
    </div>
  );
};
