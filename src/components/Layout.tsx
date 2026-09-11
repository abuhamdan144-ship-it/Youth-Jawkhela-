import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Membership', path: '/membership' },
    { name: 'Cabinet', path: '/cabinet' },
    { name: 'News', path: '/news' },
    { name: 'Events', path: '/events' },
    { name: 'Donate', path: '/donate' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-light flex flex-col font-sans text-gray-900">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  ZJ
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-primary leading-tight">Zwanan Jawkhela</span>
                  <span className="text-xs text-gray-500 font-medium">Community Portal</span>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 hover:text-primary font-medium px-3 py-2 rounded-md transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-green-50"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="bg-accent text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-secondary">Zwanan Jawkhela</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                A professional welfare organization dedicated to the betterment of Jawkhela village in Buner, KPK, Pakistan. We unite the diaspora and local community for collective progress.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
                <li><Link to="/membership" className="hover:text-secondary transition-colors">Membership</Link></li>
                <li><Link to="/donate" className="hover:text-secondary transition-colors">Donate</Link></li>
                <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2 inline-block">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Jawkhela, Buner, KPK</li>
                <li>Pakistan</li>
                <li>info@zwanan-jawkhel.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-[#888888]">
            <p>Preparing websites by SHAUKAT KHAN YOUSAF</p>
            <p className="mt-1 italic">(Pray request for his late father Yousaf Khan)</p>
            <p className="mt-4">&copy; {new Date().getFullYear()} Zwanan Jawkhela. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
