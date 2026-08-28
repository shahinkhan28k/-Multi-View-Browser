import { useState, useEffect, FormEvent } from 'react';
import { 
  Facebook, 
  Youtube, 
  Send, 
  Instagram, 
  Video, 
  User, 
  ExternalLink, 
  Lock, 
  Unlock,
  Save
} from 'lucide-react';
import { SocialLinks } from '../types';

export function DeveloperView() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passcode, setPasscode] = useState('');
  
  const [links, setLinks] = useState<SocialLinks>({
    banner: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop',
    name: 'Your Name Here',
    bio: 'Digital Creator & Full Stack Developer. Passionate about building modern web applications.',
    passcode: '2026',
    facebook: 'https://facebook.com/yourprofile',
    facebookPage: 'https://facebook.com/yourpage',
    tiktok: 'https://tiktok.com/@yourprofile',
    telegram: 'https://t.me/yourchannel',
    youtube: 'https://youtube.com/@yourchannel',
    instagram: 'https://instagram.com/yourprofile'
  });

  useEffect(() => {
    const savedLinks = localStorage.getItem('developer_links');
    if (savedLinks) {
      try {
        const parsed = JSON.parse(savedLinks);
        // Merge with defaults to ensure no field is undefined (fixes controlled/uncontrolled warning)
        setLinks(prev => ({
          ...prev,
          ...parsed,
          passcode: parsed.passcode || prev.passcode
        }));
      } catch (e) {
        console.error('Failed to parse saved links', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('developer_links', JSON.stringify(links));
    setIsAdmin(false);
    alert('Developer Profile Updated Successfully!');
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === links.passcode) {
      setIsAdmin(true);
      setShowLogin(false);
      setPasscode('');
    } else {
      alert('Incorrect Secret Code!');
    }
  };

  const socialItems = [
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'facebookPage', label: 'FB Page', icon: Facebook, color: 'text-blue-800', bgColor: 'bg-blue-100' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-black', bgColor: 'bg-gray-100' },
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-500', bgColor: 'bg-sky-50' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32 bg-[#0a0f1a] scrollbar-hide">
      {/* Banner Section */}
      <div className="relative h-64 w-full flex-shrink-0 overflow-hidden bg-slate-900 shadow-2xl">
        <img 
          src={links.banner} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />
        
        <div className="absolute top-6 right-6 flex items-center gap-2 z-30">
          <button 
            onClick={() => isAdmin ? handleSave() : setShowLogin(!showLogin)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl backdrop-blur-xl transition-all shadow-2xl font-black text-xs tracking-widest ${
              isAdmin 
                ? 'bg-blue-600 text-white hover:bg-blue-500 ring-4 ring-blue-500/20' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            {isAdmin ? (
              <>
                <Save size={18} />
                <span>SAVE CHANGES</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>ADMIN LOGIN</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="bg-[#161e2d] rounded-[2rem] shadow-2xl shadow-black/60 p-8 border border-white/5">
          <div className="flex flex-col gap-6">
            {isAdmin ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block ml-1">ব্যানার ফটো লিঙ্ক (Banner URL)</label>
                  <input 
                    type="text"
                    value={links.banner}
                    onChange={(e) => setLinks({...links, banner: e.target.value})}
                    className="w-full h-14 bg-white/5 rounded-2xl px-5 text-xs border-2 border-white/5 focus:border-blue-500 outline-none text-white transition-all placeholder:text-gray-600"
                    placeholder="পিকচার লিঙ্ক এখানে দিন"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block ml-1">আপনার নাম (Name)</label>
                  <input 
                    type="text"
                    value={links.name}
                    onChange={(e) => setLinks({...links, name: e.target.value})}
                    className="w-full h-14 bg-white/5 rounded-2xl px-5 text-sm font-bold border-2 border-white/5 focus:border-blue-500 outline-none text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block ml-1">আপনার সম্পর্কে (Bio)</label>
                  <textarea 
                    value={links.bio}
                    onChange={(e) => setLinks({...links, bio: e.target.value})}
                    rows={3}
                    className="w-full bg-white/5 rounded-2xl p-5 text-sm font-medium border-2 border-white/5 focus:border-blue-500 outline-none resize-none text-white transition-all"
                  />
                </div>
                <div className="pt-6 border-t border-white/5 space-y-2">
                  <label className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] block ml-1">পাসকোড পরিবর্তন করুন (Change Passcode)</label>
                  <input 
                    type="text"
                    maxLength={10}
                    value={links.passcode}
                    onChange={(e) => setLinks({...links, passcode: e.target.value.replace(/\D/g, '')})}
                    className="w-full h-14 bg-red-500/10 rounded-2xl px-5 text-sm font-black tracking-[0.5em] border-2 border-red-500/20 focus:border-red-500 outline-none text-red-400 transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{links.name}</h2>
                <div className="w-16 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                <p className="mt-6 text-sm text-gray-400 font-medium leading-relaxed px-2">
                  {links.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <div className="px-6 mt-6">
          <form onSubmit={handleLogin} className="p-5 bg-[#161e2d] rounded-2xl border border-white/5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Admin Verification</label>
              <Unlock size={14} className="text-blue-500" />
            </div>
            <div className="flex gap-3">
              <input 
                type="password"
                maxLength={10}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••"
                className="flex-1 h-12 bg-white/5 rounded-xl px-4 text-center tracking-[0.5em] font-black text-white outline-none border-2 border-white/5 focus:border-blue-500 transition-all"
              />
              <button type="submit" className="px-6 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                VERIFY
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Social Links Grid */}
      <div className="px-6 mt-8">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 px-1">Connect with me</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialItems.map((item) => {
            const key = item.id as keyof SocialLinks;
            return (
              <div key={item.id} className="bg-[#161e2d] rounded-2xl border border-white/5 p-5 shadow-lg hover:border-white/10 transition-all group">
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-14 h-14 ${item.bgColor.replace('bg-', 'bg-opacity-10 bg-')} ${item.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} />
                  </div>
                  <span className="font-black text-gray-300 text-[10px] uppercase tracking-widest">{item.label}</span>
                  
                  {isAdmin ? (
                    <input 
                      type="text"
                      value={links[key as keyof SocialLinks] as string}
                      onChange={(e) => setLinks({...links, [key]: e.target.value})}
                      className="w-full h-9 bg-white/5 rounded-lg px-3 text-[10px] border border-white/10 focus:border-blue-500 outline-none text-white font-medium"
                    />
                  ) : (
                    <a 
                      href={links[key as keyof SocialLinks] as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full h-11 bg-white/5 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-white/5 group-hover:border-blue-500/50"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
