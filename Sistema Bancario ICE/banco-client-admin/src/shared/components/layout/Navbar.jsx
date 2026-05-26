import { BellIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AvatarUser } from '../ui/AvatarUser.jsx';

export const Navbar = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
                <p className="text-sm text-gray-500">
                    {' '}
                    <span className="text-[#003A8F] font-medium">Banco ICE</span>
                </p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-gray-400 hover:text-[#003A8F] transition-colors">
                    <BellIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                    <AvatarUser user={user} />
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                            {user?.firstName || user?.username || 'Admin'}
                        </p>
                        <p className="text-[11px] text-gray-400">{user?.role || 'ADMIN_ROLE'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
