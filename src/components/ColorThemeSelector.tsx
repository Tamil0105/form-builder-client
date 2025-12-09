import React from 'react';
import type { ColorTheme } from '../types';
import { themeConfigs, themeNames } from '../utils/themeConfig';
import { Palette } from 'lucide-react';

interface ColorThemeSelectorProps {
  selectedTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
}

export const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
}) => {
  const themes: ColorTheme[] = ['purple', 'blue', 'green', 'orange', 'pink'];

  return (
    <div className="space-y-3">
      <label className="font-bold text-gray-800 flex items-center space-x-2">
        <Palette className="w-5 h-5" />
        <span>Color Theme</span>
      </label>
      
      <div className="grid grid-cols-5 gap-3">
        {themes.map((theme) => {
          const config = themeConfigs[theme];
          const isSelected = selectedTheme === theme;
          
          return (
            <button
              key={theme}
              type="button"
              onClick={() => onThemeChange(theme)}
              className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                isSelected
                  ? 'border-gray-900 shadow-lg ring-2 ring-offset-2 ring-gray-900'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="space-y-2">
                {/* Color Preview */}
                <div
                  className="h-12 rounded-lg"
                  style={{ background: config.gradient }}
                />
                
                {/* Theme Name */}
                <p className="text-xs font-semibold text-gray-700 text-center">
                  {themeNames[theme]}
                </p>
              </div>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
