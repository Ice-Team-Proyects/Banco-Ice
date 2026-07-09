import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { motion } from 'motion/react';

// Dashboard container con estética Banco ICE: fondo oscuro, tarjeta crema y brasas animadas
export const DashboardContainer = ({ children }) => {
  const embers = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1.5,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 5 + 5,
  }));

  return (
    <div className="min-h-screen w-full relative bg-[#131313] text-stone-900 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute bottom-[-8px] bg-gradient-to-t from-[#ff5625] to-[#dac49b] rounded-full opacity-40 filter blur-[1px]"
            style={{ width: ember.size, height: ember.size, left: `${ember.left}%` }}
            animate={{ y: [0, -900], x: [0, Math.sin(ember.id) * 40], opacity: [0, 0.6, 0.9, 0.3, 0] }}
            transition={{ duration: ember.duration, repeat: Infinity, delay: ember.delay, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 md:px-8 py-8">
          <Navbar />

          <main className="flex-1 overflow-auto">
            <div className="max-w-[1200px] mx-auto">
              <div className="bg-[#FDF5E6] rounded-[1.75rem] border-l-4 border-[#8b0000] shadow-[0_20px_60px_rgba(255,86,37,0.16)] p-6 md:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

