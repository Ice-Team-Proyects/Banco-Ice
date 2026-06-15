import { BellIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AvatarUser } from '../ui/AvatarUser.jsx';
import { Landmark } from 'lucide-react';

export const Navbar = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 bg-transparent flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-2xl bg-[#FDF5E6]/20">
                    <Landmark className="w-8 h-8 text-[#8b0000] stroke-[1.5]" />
                </div>
                <div>
                    <p className="font-serif text-lg text-[#131313] font-bold tracking-wider">Banco ICE</p>
                    <p className="text-[11px] text-stone-500 font-mono uppercase tracking-widest">Hinokami Portal</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative text-stone-100 hover:text-[#ffb8b2] transition-colors">
                    <BellIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 rounded-[2rem] bg-white/12 border border-white/10 px-3 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
                    <AvatarUser user={user} />
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-white leading-tight">{user?.firstName || user?.username || 'Admin'}</p>
                        <p className="text-[11px] text-[#d1d7e0]">{user?.role || 'ADMIN_ROLE'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
