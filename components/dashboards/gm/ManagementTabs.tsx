
import React from 'react';
import { Users, Store, TrendingUp, BookOpen } from 'lucide-react';

export const HRTab: React.FC<{ hrData: any }> = ({ hrData }) => {
  if (!hrData) return <div>Loading HR Data...</div>;
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-widest"><Users size={14} className="inline-block -mt-1 mr-2" /> HR / Shift Status</h3>
      <div className="space-y-2 text-xs">
        {hrData.schedule.map((staff: any) => (
          <div key={staff.name} className="flex justify-between items-center p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
            <div><span className="font-bold">{staff.name}</span><span className="text-zinc-500 ml-2">({hrData.department})</span></div>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">{staff.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommercialTab: React.FC<{ commercialData: any[] }> = ({ commercialData }) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-widest"><Store size={14} className="inline-block -mt-1 mr-2" /> Commercial Tenants</h3>
      <div className="space-y-2 text-xs">
        {commercialData.map((tenant: any) => (
          <div key={tenant.id} className="flex justify-between items-center p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
            <div><span className="font-bold">{tenant.name}</span><span className="text-zinc-500 ml-2">(Rent: €{tenant.rent})</span></div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tenant.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500 animate-pulse'}`}>{tenant.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsTab: React.FC<{ analyticsData: any }> = ({ analyticsData }) => {
  if (!analyticsData) return <div>Loading Analytics...</div>;
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-widest"><TrendingUp size={14} className="inline-block -mt-1 mr-2" /> Strategic Analytics</h3>
      <div className="bg-white dark:bg-zinc-900 p-4 rounded text-center">
        <div className="text-xs text-zinc-500 uppercase">Predicted Occupancy ({analyticsData.period})</div>
        <div className="text-5xl font-black text-indigo-500 my-2">{analyticsData.prediction}%</div>
        <div className="text-[10px] text-zinc-400">(Confidence: {analyticsData.confidence}%)</div>
      </div>
    </div>
  );
};

export const BookingsTab: React.FC<{ bookings: any[] }> = ({ bookings }) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} /> Online Reservations</h3>
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <div className="text-xs text-zinc-500 italic text-center p-4">No active booking requests.</div>
        ) : (
          bookings.map((booking, i) => (
            <div key={i} className="p-3 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
              <div className="flex justify-between items-start">
                <div><span className="text-xs font-bold block">S/Y Wind Chaser</span><span className="text-[10px] text-zinc-500">June 10 - June 15</span></div>
                <span className="text-xs font-bold text-emerald-500">€{booking.totalCost.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-[10px] bg-zinc-100 dark:bg-zinc-800 p-2 rounded">Auto-Assigned: <strong>{booking.berth}</strong> <span className="text-zinc-500">({booking.reasoning})</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
