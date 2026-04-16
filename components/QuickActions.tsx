
import React from 'react';
import { 
    ArrowDown, 
    ArrowUp, 
    CircleDollarSign, 
    AlertTriangle, 
    Wifi, 
    Car, 
    Utensils, 
    LifeBuoy, 
    Recycle, 
    FileText 
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (text: string) => void;
  userRole: 'GUEST' | 'CAPTAIN' | 'GENERAL_MANAGER';
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, userRole }) => {
  
  // Define Role-Specific Action Sets
  const actions = [
    // --- GUEST ACTIONS ---
    { label: 'Wi-Fi Access', icon: Wifi, text: 'What is the guest wifi password?', roles: ['GUEST'] },
    { label: 'Book Table', icon: Utensils, text: 'Reserve a table at Poem Restaurant for tonight', roles: ['GUEST'] },
    { label: 'Call Taxi', icon: Car, text: 'I need a taxi at the main gate', roles: ['GUEST'] },
    
    // --- CAPTAIN ACTIONS ---
    { label: 'Departure', icon: ArrowUp, text: 'Request departure clearance for S/Y Phisedelia', roles: ['CAPTAIN', 'GENERAL_MANAGER'] },
    { label: 'Arrival', icon: ArrowDown, text: 'Process arrival for S/Y Phisedelia', roles: ['CAPTAIN', 'GENERAL_MANAGER'] },
    { label: 'Blue Card', icon: Recycle, text: 'I need a waste pump-out (Blue Card)', roles: ['CAPTAIN'] },
    { label: 'My Balance', icon: CircleDollarSign, text: 'Check my account balance', roles: ['CAPTAIN'] },
    
    // --- GM ACTIONS ---
    { label: 'Daily Report', icon: FileText, text: 'Generate daily operations report', roles: ['GENERAL_MANAGER'] },
    { label: 'Incidents', icon: AlertTriangle, text: 'List critical incidents for today', roles: ['GENERAL_MANAGER'] },
    { label: 'Staff Status', icon: LifeBuoy, text: 'Show security patrol status', roles: ['GENERAL_MANAGER'] },
  ];

  const visibleActions = actions.filter(action => action.roles.includes(userRole));

  return (
    <div className="flex items-center sm:justify-center gap-2 mt-2 px-0 sm:px-6 overflow-x-auto custom-scrollbar no-scrollbar pb-1 w-full">
      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase font-bold whitespace-nowrap hidden sm:inline">Quick Actions:</span>
      {visibleActions.map(action => (
        <button 
          key={action.label}
          onClick={() => onAction(action.text)}
          className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-md text-[10px] font-mono text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <action.icon size={12} />
          {action.label}
        </button>
      ))}
    </div>
  );
};
