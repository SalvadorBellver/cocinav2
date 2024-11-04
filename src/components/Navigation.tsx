import React, { useState } from 'react';
import { CalendarDays, ChefHat, ShoppingBag, History, Menu, X } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItem) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 w-full group ${
      isActive 
        ? 'bg-gradient-to-r from-pastel-pink-50 to-pastel-blue-50 text-gray-900'
        : 'text-gray-600 hover:bg-gradient-to-r hover:from-pastel-pink-50/50 hover:to-pastel-blue-50/50'
    }`}
  >
    <div className={`p-2 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-white/50'
        : 'bg-white group-hover:bg-white/50'
    }`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </button>
);

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Navigation = ({ activeSection, onSectionChange }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'calendar', icon: <CalendarDays className="w-5 h-5" />, label: 'Calendario' },
    { id: 'planner', icon: <ChefHat className="w-5 h-5" />, label: 'Planificador' },
    { id: 'shopping', icon: <ShoppingBag className="w-5 h-5" />, label: 'Lista de Compra' },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'Historial' },
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-pastel-pink-500 text-white rounded-full shadow-lg hover:bg-pastel-pink-600 transition-colors"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-500/20 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Navigation Menu */}
      <nav className={`
        fixed lg:sticky lg:top-28 z-40
        ${isMenuOpen ? 'bottom-24' : '-bottom-full'}
        left-4 right-4 lg:left-auto lg:right-auto lg:bottom-auto
        transition-all duration-300 ease-in-out
        lg:transition-none
        p-4 card h-fit bg-white/95 lg:bg-white/80
        lg:block
      `}>
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <NavItem
              key={section.id}
              icon={section.icon}
              label={section.label}
              isActive={activeSection === section.id}
              onClick={() => handleSectionChange(section.id)}
            />
          ))}
        </div>
      </nav>
    </>
  );
};