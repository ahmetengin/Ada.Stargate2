
import React, { useState } from 'react';
import { ScanLine, ShieldCheck, Smartphone, UserCheck, Siren, UploadCloud, CheckCircle2, Calendar, Clock, Radar, UserPlus, X } from 'lucide-react';
import { GuestProfile } from '../../../types';

export const GuestCheckInTab: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedData, setScannedData] = useState<Partial<GuestProfile> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Mock Expected Arrivals
  const [expectedArrivals, setExpectedArrivals] = useState([
      { id: 'EXP-PHI', type: 'VESSEL', name: 'S/Y Phisedelia', contact: 'Cpt. Barbaros', eta: 'Tomorrow 10:00', status: 'INBOUND' },
      { id: 'EXP-02', type: 'GUEST', name: 'Mr. John Wick', contact: 'Host: M/Y Poseidon', eta: 'Tomorrow 14:00', status: 'SCHEDULED' },
  ]);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedData({
            id: "U12345678",
            fullName: "AHMET ENGIN",
            nationality: "TUR",
            dob: "1980-06-15",
            vesselName: "S/Y Phisedelia"
          });
          return 100;
        }
        return prev + 5;
      });
    }, 50);
  };

  const handleCheckIn = () => {
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setCheckInComplete(true); }, 1500);
  };

  const reset = () => {
      setScannedData(null);
      setCheckInComplete(false);
      setScanProgress(0);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <UserCheck size={16} className="text-indigo-500" /> Guest Entry
          </h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">Law No. 1774 Reporting</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[9px] font-bold bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">
            <Siren size={10} className="animate-pulse" /> POLICE LINK ACTIVE
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-y-auto">
          
          {/* LEFT: SCANNER */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center">
              {!scannedData ? (
                  <div className="space-y-4 w-full max-w-xs">
                      {isScanning ? (
                          <div className="w-full">
                              <div className="text-xs font-bold text-indigo-500 uppercase mb-2">Scanning MRZ...</div>
                              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 transition-all" style={{ width: `${scanProgress}%` }}></div>
                              </div>
                          </div>
                      ) : (
                          <>
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                                <ScanLine size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Identity Scan</h4>
                                <p className="text-[10px] text-zinc-500 mt-1">Place ID/Passport on reader</p>
                            </div>
                            <button onClick={handleScan} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider">
                                Start Scan
                            </button>
                          </>
                      )}
                  </div>
              ) : (
                  <div className="w-full animate-in zoom-in duration-300">
                      {checkInComplete ? (
                          <div className="space-y-4">
                              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500"><CheckCircle2 size={32} /></div>
                              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">ENTRY AUTHORIZED</div>
                              <button onClick={reset} className="text-xs text-zinc-500 underline">Next Guest</button>
                          </div>
                      ) : (
                          <div className="space-y-4 text-left">
                              <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded text-xs space-y-2">
                                  <div><span className="text-zinc-500 block text-[9px] uppercase">Name</span><span className="font-bold">{scannedData.fullName}</span></div>
                                  <div><span className="text-zinc-500 block text-[9px] uppercase">ID</span><span className="font-mono">{scannedData.id}</span></div>
                                  <div><span className="text-zinc-500 block text-[9px] uppercase">Vessel</span><span className="font-bold text-indigo-500">{scannedData.vesselName}</span></div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={reset} className="flex-1 py-2 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-bold">CANCEL</button>
                                  <button onClick={handleCheckIn} className="flex-[2] py-2 bg-emerald-600 text-white rounded text-xs font-bold flex items-center justify-center gap-2">
                                      {isSubmitting ? <UploadCloud size={14} className="animate-bounce" /> : <ShieldCheck size={14} />} SUBMIT
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* RIGHT: LIST */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Expected</span>
                  <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded hover:bg-zinc-50">+ Add</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {showScheduleForm && (
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded border border-indigo-100 dark:border-indigo-800/30 text-xs">
                          <input type="text" placeholder="Guest Name" className="w-full p-1 mb-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
                          <button className="w-full bg-indigo-500 text-white py-1 rounded font-bold" onClick={() => setShowScheduleForm(false)}>Save</button>
                      </div>
                  )}
                  {expectedArrivals.map(item => (
                      <div key={item.id} onClick={() => !scannedData && setScannedData({ fullName: item.name, vesselName: 'Select Vessel' })} className="p-2 border border-zinc-100 dark:border-zinc-800 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                          <div className="flex justify-between">
                              <span className="text-xs font-bold">{item.name}</span>
                              <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">{item.eta}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">{item.contact}</div>
                      </div>
                  ))}
              </div>
          </div>

      </div>
    </div>
  );
};
