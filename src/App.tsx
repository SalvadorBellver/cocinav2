import React, { useEffect, useState } from 'react';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ShoppingList } from './components/ShoppingList';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { ChefHat, CheckCircle2, LogOut } from 'lucide-react';
import { useMenuStore } from './store/menuStore';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const initializeWeeklyMenu = useMenuStore((state) => state.initializeWeeklyMenu);
  const [activeSection, setActiveSection] = useState('calendar');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      initializeWeeklyMenu();
    } finally {
      setIsLoading(false);
    }
  }, [initializeWeeklyMenu]);

  const handlePlanSuccess = () => {
    setActiveSection('calendar');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      );
    }

    switch (activeSection) {
      case 'planner':
        return <WeeklyPlanner onSuccess={handlePlanSuccess} />;
      case 'shopping':
        return <ShoppingList />;
      case 'calendar':
        return <WeeklyCalendar />;
      case 'history':
        return (
          <div className="card p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-50 flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recipe History</h3>
              <p className="text-gray-600">Coming soon! You'll be able to view and manage your previous menus here.</p>
            </div>
          </div>
        );
      default:
        return <WeeklyCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/60 border-b border-neutral-200/50">
        <div className="max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 glass-effect rounded-2xl animate-pulse-slow bg-gradient-to-br from-primary-50 to-secondary-50">
                <ChefHat className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Weekly Menu Planner</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome, {user.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-gradient-to-r from-primary-50 to-secondary-50 text-gray-900 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-slide-up">
            <div className="p-2 bg-white/50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
            </div>
            <span className="font-medium">Weekly plan generated successfully!</span>
          </div>
        )}
        
        <div className="grid lg:grid-cols-[280px,1fr] gap-8">
          <Navigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <div className="space-y-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;