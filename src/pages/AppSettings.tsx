import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const AppSettings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        App Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-sky-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Switch between light and dark themes
          </p>
        </div>
      </div>
    </div>
  );
};