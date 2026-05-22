import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, MapPin, Camera, CheckCircle2, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

interface RegistrationFormProps {
  initialData: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  isEditing?: boolean;
}

export default function RegistrationForm({ initialData, onComplete, isEditing = false }: RegistrationFormProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialData || {
      name: '',
      age: '',
      phone: '',
      address: '',
      pinCode: '',
      profilePic: null,
    }
  );
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip verification flow if just modifying profiles
    if (isEditing) {
      onComplete(profile);
      return;
    }

    if (!isCodeSent) {
      setIsCodeSent(true);
      return;
    }

    if (verificationCode === '7777') {
      onComplete(profile);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto glass p-8 rounded-3xl mt-12 relative overflow-hidden border border-white/10"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A9B4]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="text-center mb-10">
        <h2 className="text-4xl font-display font-bold text-[#E5A9B4] mb-2 italic">
          {isEditing ? 'Modify Profile Space' : 'Welcome to GlowNext Premium'}
        </h2>
        <p className="text-white/40 font-light tracking-wide uppercase text-xs">
          {isEditing ? 'Update verification parameters' : 'Unlock Your Elite Radiance'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full border-2 border-dashed border-[#E5A9B4]/30 flex items-center justify-center cursor-pointer hover:border-[#E5A9B4] transition-colors relative group overflow-hidden bg-white/5"
          >
            {profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile Capture" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-[#E5A9B4]/50 group-hover:text-[#E5A9B4] transition-colors" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[10px] uppercase font-bold text-[#E5A9B4]">Upload Target</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5A9B4]/50" />
              <input
                required
                type="text"
                placeholder="Enter registration name"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E5A9B4] outline-none transition-colors"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Age Identity</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5A9B4]/50" />
              <input
                required
                type="number"
                placeholder="Age"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E5A9B4] outline-none transition-colors"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Secure Contact Link</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5A9B4]/50" />
              <input
                required
                type="tel"
                placeholder="Phone connection matrix"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#E5A9B4] outline-none transition-colors"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Postal Pincode</label>
            <input
              required
              type="text"
              placeholder="Pincode zone"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#E5A9B4] outline-none transition-colors"
              value={profile.pinCode}
              onChange={e => setProfile({ ...profile, pinCode: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Delivery Address Vector</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-4 h-4 text-[#E5A9B4]/50" />
            <textarea
              required
              placeholder="Enter exact localized address breakdown"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 min-h-[100px] text-white focus:border-[#E5A9B4] outline-none transition-colors resize-none"
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
        </div>

        <AnimatePresence>
          {isCodeSent && !isEditing && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-[10px] uppercase font-bold text-[#E5A9B4] ml-1">Validation Access Code (Sent)</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5A9B4]/50" />
                <input
                  required
                  type="text"
                  placeholder="Master Code: 7777"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#E5A9B4] text-center tracking-[1em] outline-none transition-colors text-white"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
              </div>
              <AnimatePresence>
                {codeError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-red-400 font-bold uppercase text-center mt-2"
                  >
                    Verification link denied. Input master connection payload "7777"
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="btn-premium w-full mt-4 py-4 text-lg">
          {isEditing ? 'Commit Profile Changes' : isCodeSent ? 'Verify & Finalize Account' : 'Transmit Verification Code'}
        </button>
      </form>
    </motion.div>
  );
}