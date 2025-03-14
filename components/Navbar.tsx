'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700';
  };
  
  return (
    <nav className="bg-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">RoelasWorkforce</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/employees" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/employees')}`}
                >
                  Funcionários
                </Link>
                <Link 
                  href="/shifts" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/shifts')}`}
                >
                  Turnos
                </Link>
                <Link 
                  href="/payroll" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/payroll')}`}
                >
                  Folha de Pagamento
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-indigo-100 hover:text-white">
                <span className="sr-only">Notificações</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/employees" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/employees')}`}
          >
            Funcionários
          </Link>
          <Link 
            href="/shifts" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/shifts')}`}
          >
            Turnos
          </Link>
          <Link 
            href="/payroll" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/payroll')}`}
          >
            Folha de Pagamento
          </Link>
        </div>
      </div>
    </nav>
  );
}