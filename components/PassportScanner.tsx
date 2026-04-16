
import React, { useEffect, useRef, useState } from 'react';
import { X, ScanLine, Smartphone, AlertTriangle, CameraOff, CreditCard, UserSquare2, Focus, MoveDown } from 'lucide-react';

interface ScanResult {
    type: 'PASSPORT' | 'CARD';
    data: any;
}

interface PassportScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (result: ScanResult) => void;
}

export const PassportScanner: React.FC<PassportScannerProps> = ({ isOpen, onClose, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'PASSPORT' | 'CARD'>('PASSPORT');
  const [focusDistance, setFocusDistance] = useState(50); // cm

  useEffect(() => {
    if (isOpen) {
      setError(null); 
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  useEffect(() => {
      setProgress(0);
      setStatusText(mode === 'PASSPORT' ? 'Align Passport Page' : 'Align Credit Card');
  }, [mode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
              facingMode: 'environment',
              width: { ideal: 1920 }, // Prefer High Res for OCR
              height: { ideal: 1080 } 
          } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setScanning(true);
      simulateScanning();
    } catch (err: any) {
      console.error("Camera access denied", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("Camera permission was denied.");
      } else {
          setError("Unable to access camera.");
      }
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
    setProgress(0);
  };

  const simulateScanning = () => {
    let p = 0;
    
    // Simulate focusing movement
    let dist = 50;
    const focusInterval = setInterval(() => {
        dist = Math.max(12, dist - 2);
        setFocusDistance(dist);
        if (p >= 100) clearInterval(focusInterval);
    }, 100);

    const interval = setInterval(() => {
      p += 1.5; 
      setProgress(p);
      
      if (p < 20) setStatusText("Acquiring Macro Focus...");
      if (p > 20 && p < 40) setStatusText("Distance: " + Math.round(focusDistance) + "cm (Adjusting...)");
      if (p > 40 && p < 70) setStatusText(mode === 'PASSPORT' ? "OCR Active: Reading MRZ..." : "NFC Active: Reading Chip...");
      if (p > 70) setStatusText("Validating Checksums...");

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
            finishScan();
        }, 500);
      }
    }, 50);
  };

  const finishScan = () => {
      if (mode === 'PASSPORT') {
        onScanComplete({
            type: 'PASSPORT',
            data: {
                name: "AHMET ENGIN",
                id: "U12345678",
                nationality: "TUR",
                dob: "15-06-1980",
                expiry: "12-05-2030",
                issuer: "TUR"
            }
        });
      } else {
        // Provision Mode: No CVV, just card details for block
        onScanComplete({
            type: 'CARD',
            data: {
                network: "VISA",
                number: "4543 **** **** 1234",
                holder: "AHMET ENGIN",
                expiry: "12/28"
            }
        });
      }
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col font-sans">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-white">
            <ScanLine className="text-emerald-500" />
            <span className="font-medium text-sm">
                {mode === 'PASSPORT' ? 'Identity Verification' : 'Payment Provision'}
            </span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="absolute top-20 left-0 right-0 z-20 flex justify-center gap-4 px-4">
          <button 
            onClick={() => setMode('PASSPORT')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all shadow-lg ${mode === 'PASSPORT' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'}`}
          >
              <UserSquare2 size={18} />
              <span className="text-xs font-bold uppercase">Passport</span>
          </button>
          <button 
            onClick={() => setMode('CARD')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all shadow-lg ${mode === 'CARD' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'}`}
          >
              <CreditCard size={18} />
              <span className="text-xs font-bold uppercase">Card</span>
          </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {error ? (
            <div className="max-w-md p-6 bg-zinc-900 rounded-xl border border-red-500/30 text-center mx-4">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-red-500/10 rounded-full">
                        <CameraOff size={32} className="text-red-500" />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Camera Error</h3>
                <p className="text-sm text-zinc-400 mb-6">{error}</p>
                <button 
                    onClick={() => { setError(null); startCamera(); }}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Retry
                </button>
            </div>
        ) : (
            <>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                
                {/* Tech Overlay (Distance & Focus) */}
                <div className="absolute top-1/3 left-4 space-y-2 z-20">
                    <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono border border-emerald-500/30">
                        <Focus size={12} />
                        MACRO LENS: ON
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                        <MoveDown size={12} className={focusDistance > 15 ? 'text-amber-500 animate-bounce' : 'text-emerald-500'} />
                        DIST: {Math.round(focusDistance)}cm {focusDistance > 15 ? '(MOVE CLOSER)' : '(OPTIMAL)'}
                    </div>
                </div>

                {/* Scanner Frame - Clean Look */}
                <div 
                    className={`relative border-2 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 z-10
                    ${mode === 'PASSPORT' 
                        ? 'w-[85%] max-w-md aspect-[1.58/1] border-white/50' 
                        : 'w-[85%] max-w-md aspect-[1.58/1] border-white/50'
                    }`}
                >
                    {/* Scanning Line */}
                    <div className={`absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]`}></div>
                    
                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white"></div>
                    
                    {/* MRZ Zone Indicator (Passport Only) */}
                    {mode === 'PASSPORT' && (
                        <div className="absolute bottom-4 left-4 right-4 h-8 border border-dashed border-yellow-500/50 bg-yellow-500/10 rounded flex items-center justify-center">
                            <span className="text-[9px] text-yellow-500 font-bold tracking-widest uppercase">Align MRZ Zone &lt;&lt;&lt;</span>
                        </div>
                    )}
                </div>

                {/* Status Text */}
                <div className="absolute bottom-32 text-center w-full z-20">
                    <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-white/10">
                        <p className="text-white text-sm font-mono flex items-center gap-2">
                            {progress < 100 && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
                            {statusText}
                        </p>
                    </div>
                </div>
            </>
        )}
      </div>

      {/* Footer */}
      <div className="h-24 bg-zinc-900 border-t border-zinc-800 flex items-center px-8 justify-center">
         <div className="w-full max-w-md">
             <div className="flex justify-between text-xs text-zinc-500 uppercase mb-2 font-bold">
                 <span>Scan Confidence</span>
                 <span>{Math.round(progress)}%</span>
             </div>
             <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                 <div 
                    className={`h-full transition-all duration-100 ${mode === 'PASSPORT' ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${progress}%` }}
                 ></div>
             </div>
         </div>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0.5; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
