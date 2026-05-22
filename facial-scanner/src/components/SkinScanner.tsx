import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Zap } from 'lucide-react';
import { SkinType } from '../types';

interface SkinScannerProps {
  onResults: (type: SkinType) => void;
}

export default function SkinScanner({ onResults }: SkinScannerProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCapturing(true);
    }
  }, [webcamRef]);

  const handleAnalyze = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3200));
    
    const types: SkinType[] = ['Oily', 'Dry', 'Normal', 'Combination'];
    const curatedType = types[Math.floor(Math.random() * types.length)];
    
    onResults(curatedType);
    setIsScanning(false);
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setIsCapturing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto mt-12 px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-5xl font-display font-medium text-white italic mb-4">Premium Skin Signature Scan</h2>
        <p className="text-[#E5A9B4] tracking-[0.2em] uppercase text-xs font-semibold">Diagnostic analyzer metrics for absolute skin precision</p>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden glass border-2 border-[#E5A9B4]/20 shadow-2xl max-w-2xl mx-auto bg-black/40">
        {!capturedImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: 'user' }}
          />
        ) : (
          <img src={capturedImage} alt="Analysis Source" className="w-full h-full object-cover" />
        )}

        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div className="scan-line absolute left-0 w-full h-1 bg-[#E5A9B4] shadow-[0_0_15px_#E5A9B4]" />
              <div className="absolute inset-0 bg-[#E5A9B4]/10 backdrop-blur-[1px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-black/60 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <p className="text-[#E5A9B4] font-display italic text-2xl tracking-wider animate-pulse">Running Diagnostic Arrays...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-10 gap-6">
        {!isCapturing ? (
          <button onClick={capture} className="btn-premium flex items-center gap-3 scale-110">
            <Camera className="w-5 h-5" />
            Capture Premium Portrait
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={resetScanner} disabled={isScanning} className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Reset Stream
            </button>
            <button onClick={handleAnalyze} disabled={isScanning} className="btn-premium flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Analyze Matrix Signature
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}