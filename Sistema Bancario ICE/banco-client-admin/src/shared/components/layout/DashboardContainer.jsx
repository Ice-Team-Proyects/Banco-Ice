import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

// ✅ Fix: layout era flex-col completo → sidebar quedaba debajo del navbar
// Correcto: flex-row, sidebar al lado del main
export const DashboardContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#f0f4f8]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
