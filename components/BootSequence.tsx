
import React, { useState, useEffect } from 'react';

export const BootSequence = () => {
    const lines = [
        "Initializing Ada Stargate v3.2...",
        "Checking Secure Enclave...",
        "Loading WIM Master Data...",
        "Syncing Distributed Nodes (Redis)...",
        "Authentication Handshake: OK",
        "SYSTEM READY."
    ];
    const [visibleLines, setVisibleLines] = useState<string[]>([]);

    useEffect(() => {
        let delay = 0;
        lines.forEach((line, index) => {
            delay += Math.random() * 300 + 200;
            setTimeout(() => {
                setVisibleLines(prev => [...prev, line]);
            }, delay);
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050b14] font-mono text-zinc-500">
            <div className="text-left w-full max-w-md p-8">
                {visibleLines.map((line, index) => (
                    <p key={index} className="text-xs mb-1">
                        <span className="text-zinc-700 mr-2">{'>'}</span>
                        <span className={index === lines.length - 1 ? 'text-teal-500 font-bold animate-pulse' : 'text-zinc-400'}>
                            {line}
                        </span>
                    </p>
                ))}
            </div>
        </div>
    );
};
