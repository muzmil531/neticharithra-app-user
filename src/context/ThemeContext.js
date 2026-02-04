import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { retrieveData, saveData } from '../handelers/AsyncStorageHandeler';
import Colors from '../colors/Colors';

// Create context with default values to prevent undefined errors
const ThemeContext = createContext({
    themeMode: 'system',
    currentTheme: 'light',
    colors: Colors.light,
    setTheme: () => {},
    isDark: false,
});

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system');
    const [currentTheme, setCurrentTheme] = useState(systemColorScheme || 'light');
    const [isLoading, setIsLoading] = useState(true);

    console.log('ThemeProvider rendering with:', { systemColorScheme, themeMode, currentTheme });

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        if (themeMode === 'system') {
            setCurrentTheme(systemColorScheme || 'light');
        }
    }, [systemColorScheme, themeMode]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await retrieveData('userThemePreference', 'string');
            if (savedTheme) {
                setThemeMode(savedTheme);
                if (savedTheme !== 'system') {
                    setCurrentTheme(savedTheme);
                }
            } else {
                setThemeMode('system');
                setCurrentTheme(systemColorScheme || 'light');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
            setThemeMode('system');
            setCurrentTheme(systemColorScheme || 'light');
        } finally {
            setIsLoading(false);
        }
    };

    const setTheme = async (mode) => {
        console.log('ThemeContext.setTheme called with mode:', mode);
        try {
            setThemeMode(mode);
            await saveData('userThemePreference', mode);
            
            if (mode === 'system') {
                setCurrentTheme(systemColorScheme || 'light');
                console.log('Setting currentTheme to:', systemColorScheme || 'light');
            } else {
                setCurrentTheme(mode);
                console.log('Setting currentTheme to:', mode);
            }
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const colors = Colors[currentTheme] || Colors.light;

    const value = {
        themeMode: themeMode || 'system',
        currentTheme: currentTheme || 'light',
        colors: colors || Colors.light,
        setTheme: setTheme || (() => {}),
        isDark: currentTheme === 'dark',
    };

    console.log('ThemeProvider value:', { hasColors: !!value.colors, themeMode: value.themeMode });

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    // console.log('useTheme called, context:', { 
    //     hasContext: !!context, 
    //     hasColors: context?.colors ? 'yes' : 'no',
    //     contextKeys: context ? Object.keys(context) : 'none'
    // });
    
    if (!context || !context.colors) {
        console.warn('useTheme: Context is invalid, returning default values');
        // Return default values as fallback
        return {
            themeMode: 'system',
            currentTheme: 'light',
            colors: Colors.light,
            setTheme: () => {},
            isDark: false,
        };
    }
    return context;
};

export default ThemeContext;
