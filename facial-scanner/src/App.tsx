import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, User, Phone, MapPin, Camera, CheckCircle2, 
  Calendar, Settings, LogOut, Upload, Zap, ArrowLeft, RefreshCw, Eye
} from 'lucide-react';

// --- Type Configurations ---
type SkinType = 'Oily' | 'Dry' | 'Normal' | 'Combination';
type AppStep = 'landing' | 'auth_flow' | 'profile_edit' | 'diagnostic_hub' | 'results_view';
type CaptureMode = 'live_camera' | 'local_folder';

interface UserData {
  name: string;
  age: string;
  phone: string;
  address: string;
  pinCode: string;
  profilePic: string | null;
}

const MOCK_PRODUCTS = [
  { id: '1', name: 'Royal Glow Elixir', desc: 'Deeply hydrating serum infused with 24k gold flakes.', benefit: 'Restores natural radiance.', suitable: ['Dry', 'Normal'] },
  { id: '2', name: 'Emerald Detox Mask', desc: 'Bentonite clay and matcha tea for deep pore cleansing.', benefit: 'Eliminates excess sebum.', suitable: ['Oily', 'Combination'] },
  { id: '3', name: 'HydraBoost Pearl Mist', desc: 'Cooling mist with pearl extracts and hyaluronic acid.', benefit: 'Instant moisture barrier recovery.', suitable: ['Dry', 'Normal', 'Combination'] }
];

export default function App() {
  // --- App States ---
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [userProfile, setUserProfile] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('glownext_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [detectedSkin, setDetectedSkin] = useState<SkinType | null>(null);

  // --- Registration / Management Form State ---
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPin, setFormPin] = useState('');
  const [formPic, setFormPic] = useState<string | null>(null);
  
  // Verification handling
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(false);

  // --- Scanner States ---
  const [captureMode, setCaptureMode] = useState<CaptureMode>('live_camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helper: Sync Form with Profile ---
  const populateFormForEditing = (data: UserData) => {
    setFormName(data.name);
    setFormAge(data.age);
    setFormPhone(data.phone);
    setFormAddress(data.address);
    setFormPin(data.pinCode);
    setFormPic(data.profilePic);
  };

  const clearFormState = () => {
    setFormName('');
    setFormAge('');
    setFormPhone('');
    setFormAddress('');
    setFormPin('');
    setFormPic(null);
    setIsOtpSent(false);
    setOtpValue('');
  };

  // --- Actions ---
  const handleStartAuthFlow = () => {
    if (userProfile) {
      setCurrentStep('diagnostic_hub');
    } else {
      clearFormState();
      setCurrentStep('auth_flow');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormPic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Direct submission if editing an existing profile
    if (currentStep === 'profile_edit') {
      const updated: UserData = { name: formName, age: formAge, phone: formPhone, address: formAddress, pinCode: formPin, profilePic: formPic };
      setUserProfile(updated);
      localStorage.setItem('glownext_user', JSON.stringify(updated));
      setCurrentStep('diagnostic_hub');
      return;
    }

    // Standard Sign-up OTP trigger flow
    if (!isOtpSent) {
      setIsOtpSent(true);
      return;
    }

    if (otpValue === '1234') {
      const newUser: UserData = { name: formName, age: formAge, phone: formPhone, address: formAddress, pinCode: formPin, profilePic: formPic };
      setUserProfile(newUser);
      localStorage.setItem('glownext_user', JSON.stringify(newUser));
      setCurrentStep('diagnostic_hub');
    } else {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 2500);
    }
  };

  const triggerProfileEditMode = () => {
    if (userProfile) {
      populateFormForEditing(userProfile);
      setCurrentStep('profile_edit');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('glownext_user');
    setUserProfile(null);
    setDetectedSkin(null);
    setCapturedImage(null);
    setCurrentStep('landing');
  };

  // --- Diagnostic Scanner Logics ---
  const handleCapturePhoto = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setCapturedImage(screenshot);
  }, [webcamRef]);

  const handleLocalFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCapturedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysisEngine = async () => {
    if (!capturedImage) return;
    setIsProcessingScan(true);
    
    // Simulated diagnostic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const variations: SkinType[] = ['Oily', 'Dry', 'Normal', 'Combination'];
    const chosenResult = variations[Math.floor(Math.random() * variations.length)];
    
    setDetectedSkin(chosenResult);
    setIsProcessingScan(false);
    setCurrentStep('results_view');
  };

  return (
    <div className="min-h-screen bg-[#14050f] text-white relative overflow-x-hidden">
      {/* Cinematic Luxury Background Gradients */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-[#e5a9b4]/5 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#8a2542]/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Luxury Navigation Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5 relative z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep('landing')}>
          <div className="w-9 h-9 bg-[#e5a9b4] rounded-xl flex items-center justify-center rotate-45 shadow-md shadow-[#e5a9b4]/20">
            <Sparkles className="w-5 h-5 text-[#14050f] -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-widest text-glow">GLOW<span className="text-[#e5a9b4]">NEXT</span></span>
        </div>

        <div className="flex items-center gap-3">
          <a href="http://127.0.0.1:5502/index.html" className="px-4 py-2 text-xs uppercase tracking-widest bg-white/10 border border-white/10 rounded-full text-white/80 hover:bg-white/15 transition-colors">
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Framework Router Viewports */}
      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP A: LANDING PAGE VIEW */}
          {currentStep === 'landing' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr] items-start">
                <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden border border-white/10">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#e5a9b4]/10 rounded-full filter blur-3xl" />
                  <span className="text-[#e5a9b4] tracking-[0.4em] text-[11px] font-bold uppercase block mb-4">Live Camera + Upload</span>
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">Start with the live scan or upload your image</h2>
                  <p className="text-white/60 text-sm md:text-base font-light max-w-2xl mb-8 leading-relaxed">
                    Your journey begins with a live camera preview and instant local upload. After you capture or import an image, register to unlock the full diagnostic suite.
                  </p>
                  {userProfile && (
                    <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-wider text-white/80">
                      <User className="w-4 h-4 text-[#e5a9b4]" />
                      Signed in as <span className="font-semibold text-[#e5a9b4]">{userProfile.name}</span>
                    </div>
                  )}

                  <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 mb-6">
                    {!capturedImage ? (
                      <div className="relative h-[320px] w-full">
                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/40 flex flex-col sm:flex-row gap-3 justify-between">
                          <button onClick={handleCapturePhoto} className="btn-luxury w-full sm:w-auto px-5 py-3 rounded-full text-xs uppercase tracking-wider">
                            Capture Photo
                          </button>
                          <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto px-5 py-3 border border-white/10 rounded-full text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors">
                            Upload Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <img src={capturedImage} alt="Captured preview" className="w-full h-[320px] object-cover" />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={() => { setCaptureMode('live_camera'); setCapturedImage(null); }} className={`flex-1 py-3 rounded-full text-xs uppercase tracking-wider font-bold transition ${captureMode === 'live_camera' ? 'bg-[#e5a9b4] text-[#14050f]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                      Live Camera
                    </button>
                    <button onClick={() => { setCaptureMode('local_folder'); setCapturedImage(null); fileInputRef.current?.click(); }} className={`flex-1 py-3 rounded-full text-xs uppercase tracking-wider font-bold transition ${captureMode === 'local_folder' ? 'bg-[#e5a9b4] text-[#14050f]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                      File Upload
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleLocalFolderUpload} accept="image/*" className="hidden" />
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10">
                  <span className="text-[#e5a9b4] tracking-[0.4em] text-[11px] font-bold uppercase block mb-4">Create profile instantly</span>
                  <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Register your account and launch diagnostics</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Use the register flow to save your profile, then return any time to run the scan from the same homepage. The same live camera and upload tools remain available on the landing experience.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-[#e5a9b4] font-bold mb-2">Step 1</p>
                      <p className="text-sm text-white/70">Capture or upload a scan sample immediately.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-[#e5a9b4] font-bold mb-2">Step 2</p>
                      <p className="text-sm text-white/70">Complete registration to unlock the diagnostic hub.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-[#e5a9b4] font-bold mb-2">Step 3</p>
                      <p className="text-sm text-white/70">Run the AI scan and view personalized product recommendations.</p>
                    </div>
                  </div>

                  <button onClick={handleStartAuthFlow} className="btn-luxury w-full px-6 py-4 rounded-full text-sm uppercase tracking-wider">
                    {userProfile ? 'Continue to Scanner' : 'Create Account'}
                  </button>
                  {userProfile && (
                    <button onClick={triggerProfileEditMode} className="mt-4 w-full px-6 py-3 border border-white/10 rounded-full text-xs uppercase tracking-wider text-white/70 hover:text-white transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP B & C: ACCOUNT REGISTRATION & MODIFICATION MANAGEMENT */}
          {(currentStep === 'auth_flow' || currentStep === 'profile_edit') && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
              <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white tracking-tight">{currentStep === 'profile_edit' ? 'Modify Premium Account' : 'Initialize Identity Token'}</h3>
                  <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">{currentStep === 'profile_edit' ? 'Alter configuration payloads instantly' : 'Complete validation to open analytical paths'}</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Photo Input Interface */}
                  <div className="flex flex-col items-center mb-4">
                    <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border border-dashed border-[#e5a9b4]/40 flex items-center justify-center cursor-pointer hover:border-[#e5a9b4] transition-all relative overflow-hidden bg-white/5 group">
                      {formPic ? (
                        <img src={formPic} alt="Form Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-[#e5a9b4]/60 group-hover:text-[#e5a9b4]" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#e5a9b4] font-bold uppercase transition-all">Upload</div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
                    <span className="text-[10px] text-white/40 mt-2 uppercase tracking-wider">Profile Pic Attachment</span>
                  </div>

                  {/* Standard Form Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#e5a9b4] uppercase tracking-wider font-bold block ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input required type="text" placeholder="John Doe" value={formName} onChange={e => setFormName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#e5a9b4] outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#e5a9b4] uppercase tracking-wider font-bold block ml-1">Age Bracket</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input required type="number" placeholder="24" value={formAge} onChange={e => setFormAge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#e5a9b4] outline-none transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#e5a9b4] uppercase tracking-wider font-bold block ml-1">Phone Number Link</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input required type="tel" placeholder="+91 XXXXX XXXXX" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#e5a9b4] outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[#e5a9b4] uppercase tracking-wider font-bold block ml-1">Pin Code Matrix</label>
                      <input required type="text" placeholder="638001" value={formPin} onChange={e => setFormPin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#e5a9b4] outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#e5a9b4] uppercase tracking-wider font-bold block ml-1">Delivery Address Vector</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
                      <textarea required placeholder="Street layout details..." value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white min-h-[70px] max-h-[120px] focus:border-[#e5a9b4] outline-none transition-colors resize-none" />
                    </div>
                  </div>

                  {/* OTP Screen Segment Block */}
                  <AnimatePresence>
                    {isOtpSent && currentStep === 'auth_flow' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 overflow-hidden pt-2">
                        <label className="text-[10px] text-[#e5a9b4] font-bold uppercase tracking-wider block ml-1">Instant Phone Access Key</label>
                        <div className="relative">
                          <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e5a9b4]" />
                          <input required type="text" placeholder="Demo Code: 1234" value={otpValue} onChange={e => setOtpValue(e.target.value)} className="w-full bg-white/5 border border-[#e5a9b4]/50 rounded-xl py-2.5 pl-10 pr-4 text-center font-mono tracking-[0.5em] text-white outline-none" />
                        </div>
                        {otpError && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wide text-center mt-1">Validation sequence rejected. Check key format.</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <a href="http://127.0.0.1:5502/index.html" className="w-full sm:w-1/3 py-3 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs uppercase tracking-wider font-bold text-center transition-colors">Back to HTML Home</a>
                    <button type="button" onClick={() => setCurrentStep(currentStep === 'profile_edit' ? 'diagnostic_hub' : 'landing')} className="w-full sm:w-1/3 py-3 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs uppercase tracking-wider font-bold transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 btn-luxury py-3 rounded-xl text-xs uppercase tracking-wider font-bold">
                      {currentStep === 'profile_edit' ? 'Save System Modification' : isOtpSent ? 'Verify & Open Access' : 'Request Security Token'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP D: SKIN DIAGNOSTIC SCAN ENGINE */}
          {currentStep === 'diagnostic_hub' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold tracking-tight mb-2 italic">Diagnostic Capture Stream</h3>
                <p className="text-[#e5a9b4] uppercase tracking-widest text-xs font-semibold">Feed dynamic live webcam imagery or local data directories</p>
              </div>

              {/* Mode Toggle Selection Switch */}
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10 max-w-xs mx-auto mb-8">
                <button onClick={() => { setCaptureMode('live_camera'); setCapturedImage(null); }} className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold rounded-full flex items-center justify-center gap-2 transition-all ${captureMode === 'live_camera' ? 'bg-[#e5a9b4] text-[#14050f]' : 'text-white/60 hover:text-white'}`}>
                  <Camera className="w-3.5 h-3.5" /> Live Camera
                </button>
                <button onClick={() => { setCaptureMode('local_folder'); setCapturedImage(null); }} className={`flex-1 py-2 text-xs uppercase tracking-wider font-bold rounded-full flex items-center justify-center gap-2 transition-all ${captureMode === 'local_folder' ? 'bg-[#e5a9b4] text-[#14050f]' : 'text-white/60 hover:text-white'}`}>
                  <Upload className="w-3.5 h-3.5" /> File Upload
                </button>
              </div>

              {/* Functional Viewport Panel */}
              <div className="relative aspect-video glass-panel rounded-3xl overflow-hidden border border-[#e5a9b4]/20 bg-black/40 shadow-inner group">
                {!capturedImage ? (
                  captureMode === 'live_camera' ? (
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-white/40 hover:text-[#e5a9b4] cursor-pointer transition-colors p-6">
                      <Upload className="w-12 h-12 mb-3 stroke-1" />
                      <p className="text-sm uppercase tracking-wider font-medium">Browse Files from Local Directory</p>
                      <input type="file" ref={fileInputRef} onChange={handleLocalFolderUpload} className="hidden" accept="image/*" />
                    </div>
                  )
                ) : (
                  <img src={capturedImage} alt="Input source vector" className="w-full h-full object-cover" />
                )}

                {/* Processing Overlay Diagnostic Laser Animation */}
                <AnimatePresence>
                  {isProcessingScan && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 pointer-events-none bg-black/40 backdrop-blur-[2px]">
                      <div className="laser-line absolute left-0 w-full h-0.5 bg-[#e5a9b4] shadow-[0_0_12px_#e5a9b4]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/80 px-6 py-3 rounded-xl border border-[#e5a9b4]/30 backdrop-blur-md flex items-center gap-3">
                          <Zap className="w-4 h-4 text-[#e5a9b4] animate-bounce" />
                          <span className="text-xs font-mono uppercase tracking-widest text-[#e5a9b4]">Analyzing Structural Signature...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dynamic Bottom Controls Matrix */}
              <div className="flex justify-center gap-4 mt-6">
                {!capturedImage ? (
                  captureMode === 'live_camera' && (
                    <button onClick={handleCapturePhoto} className="btn-luxury px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Freeze Live Matrix Frame
                    </button>
                  )
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setCapturedImage(null)} disabled={isProcessingScan} className="px-5 py-2.5 border border-white/10 hover:bg-white/5 rounded-full text-xs uppercase tracking-wider font-bold text-white/70 transition-colors flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Frame
                    </button>
                    <button onClick={runAnalysisEngine} disabled={isProcessingScan} className="btn-luxury px-6 py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> Execute AI Deep Scan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP E: TARGETED RESULTS VIEWPORT */}
          {currentStep === 'results_view' && detectedSkin && (
            <motion.div initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                  <a href="http://127.0.0.1:5502/index.html" className="px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs uppercase tracking-widest text-white/80 transition-colors font-bold text-center">
                    Back to HTML Home
                  </a>
                  <button onClick={() => { setCapturedImage(null); setCurrentStep('diagnostic_hub'); }} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#e5a9b4] hover:underline font-bold">
                    <ArrowLeft className="w-4 h-4" /> Recalibrate Matrix Diagnostics
                  </button>
                </div>
                
                <div className="glass-panel p-10 rounded-[2.5rem] border border-[#e5a9b4]/30 max-w-2xl mx-auto">
                  <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Diagnostic Metrics Established</span>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white">
                    Signature: <span className="text-[#e5a9b4] italic">{detectedSkin}</span> Skin
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                  <p className="text-white/60 text-sm font-light max-w-md mx-auto">
                    Our luxury telemetry scanner matched your structural profiles to the specialized formulas below.
                  </p>
                </div>
              </div>

              {/* Dynamic Product Catalog Core */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {MOCK_PRODUCTS.filter(p => p.suitable.includes(detectedSkin)).map(product => (
                  <div key={product.id} className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-[#e5a9b4]/40 transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-white tracking-tight">{product.name}</h4>
                        <span className="text-[9px] bg-[#e5a9b4]/10 border border-[#e5a9b4]/20 text-[#e5a9b4] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Match</span>
                      </div>
                      <p className="text-white/60 text-xs font-light leading-relaxed mb-4">{product.desc}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-[11px] text-white/80 flex gap-2">
                      <Eye className="w-3.5 h-3.5 text-[#e5a9b4] shrink-0 mt-0.5" />
                      <span>{product.benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {userProfile && (
        <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-4">
          <div className="glass-panel bg-black/80 border border-white/10 rounded-full px-4 py-3 flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              {userProfile.profilePic ? (
                <img src={userProfile.profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-[#e5a9b4]/40" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <User className="w-5 h-5 text-[#e5a9b4]" />
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Signed in as</p>
                <p className="text-sm font-semibold text-white">{userProfile.name}</p>
              </div>
            </div>
            <a href="http://127.0.0.1:5502/index.html" className="text-[10px] uppercase tracking-[0.3em] text-[#e5a9b4] hover:text-white transition-colors">
              Go HTML Home
            </a>
          </div>
        </div>
      )}
    </div>
  );
}