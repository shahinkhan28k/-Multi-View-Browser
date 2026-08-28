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
      const parsed = JSON.parse(savedLinks);
      // Ensure passcode exists even in old saved data
      if (!parsed.passcode) parsed.passcode = '2026';
      setLinks(parsed);
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
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-slate-50/50">
      {/* Banner Section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-200 shadow-inner">
        <img 
          src={links.banner} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
          <button 
            onClick={() => isAdmin ? handleSave() : setShowLogin(!showLogin)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-lg transition-all shadow-xl font-bold text-sm ${
              isAdmin 
                ? 'bg-blue-600 text-white hover:bg-blue-700 ring-4 ring-blue-500/20' 
                : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            {isAdmin ? (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-6 border border-gray-50/50">
          <div className="flex flex-col gap-5">
            {isAdmin ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">ব্যানার ফটো লিঙ্ক (Banner URL)</label>
                  <input 
                    type="text"
                    value={links.banner}
                    onChange={(e) => setLinks({...links, banner: e.target.value})}
                    className="w-full h-11 bg-white rounded-xl px-4 text-xs border-2 border-gray-200 focus:border-blue-500 outline-none shadow-sm"
                    placeholder="পিকচার লিঙ্ক এখানে দিন"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">আপনার নাম (Name)</label>
                  <input 
                    type="text"
                    value={links.name}
                    onChange={(e) => setLinks({...links, name: e.target.value})}
                    className="w-full h-11 bg-white rounded-xl px-4 text-sm font-bold border-2 border-gray-200 focus:border-blue-500 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 block">আপনার সম্পর্কে (Bio)</label>
                  <textarea 
                    value={links.bio}
                    onChange={(e) => setLinks({...links, bio: e.target.value})}
                    rows={2}
                    className="w-full bg-white rounded-xl p-4 text-sm font-medium border-2 border-gray-200 focus:border-blue-500 outline-none resize-none shadow-sm"
                  />
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 block">পাসকোড পরিবর্তন করুন (Change Passcode)</label>
                  <input 
                    type="text"
                    maxLength={10}
                    value={links.passcode}
                    onChange={(e) => setLinks({...links, passcode: e.target.value.replace(/\D/g, '')})}
                    className="w-full h-11 bg-red-50/50 rounded-xl px-4 text-sm font-black tracking-[0.5em] border-2 border-red-100 focus:border-red-500 outline-none text-red-600 shadow-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{links.name}</h2>
                <div className="w-12 h-1 bg-blue-500 mx-auto mt-2 rounded-full opacity-20" />
                <p className="mt-4 text-sm text-gray-500 font-medium leading-relaxed px-2">
                  {links.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <div className="px-6 mt-6">
          <form onSubmit={handleLogin} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Admin Verification</label>
              <Unlock size={14} className="text-gray-300" />
            </div>
            <div className="flex gap-2">
              <input 
                type="password"
                maxLength={10}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••"
                className="flex-1 h-12 bg-gray-50 rounded-xl px-4 text-center tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-6 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Social Links Grid */}
      <div className="px-6 mt-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Connect with me</h3>
        <div className="grid grid-cols-2 gap-4">
          {socialItems.map((item) => {
            const key = item.id as keyof SocialLinks;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 ${item.bgColor} ${item.color} rounded-2xl flex items-center justify-center`}>
                    <item.icon size={24} />
                  </div>
                  <span className="font-bold text-gray-800 text-xs">{item.label}</span>
                  
                  {isAdmin ? (
                    <input 
                      type="text"
                      value={links[key as keyof SocialLinks] as string}
                      onChange={(e) => setLinks({...links, [key]: e.target.value})}
                      className="w-full h-8 bg-gray-50 rounded-lg px-2 text-[10px] border border-transparent focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <a 
                      href={links[key as keyof SocialLinks] as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink size={14} />
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
