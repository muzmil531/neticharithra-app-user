const colorTheme = {
    primary: "#C4DAFE",
    white: '#FFFFFF',
    whiteSmoke: "#f5f5f5",
    grey:"grey",
    lightGrey:"#C4C7C5",
    activeColor: "#442EB7",
    black: "black",
    greyColor:"#f7f7f7",
    brandColor: "#B61F24",
    brandColorLight: "#d32f2f",

    // darkmode
    darkPrimary: "#1A1A1A",
    darkGrey: "#202020",
    darkSecondary: "#121212",
    pallateColor3: "#262626",
    pallateColor4: "#2C2C2C",
    pallateColor5: "#333333",
    pallateColor6:"#D9D9D9",
    darkBorder: "#404040",
    darkCard: "#1E1E1E",
    darkText: "#E0E0E0",
    darkTextSecondary: "#B0B0B0"
};

const light = {
    // Navigation & Headers
    navColor: colorTheme.greyColor,
    headerThemeBg: colorTheme.white,
    headerThemeText: colorTheme.black,
    
    // Text Colors
    heading: colorTheme.black,
    textColor: colorTheme.grey,
    textPrimary: '#1a1a1a',
    textSecondary: '#666',
    textTertiary: '#999',
    
    // Backgrounds
    backgroundColor: colorTheme.whiteSmoke,
    cardBackground: colorTheme.white,
    surface: colorTheme.white,
    screenBackground: '#f8f9fa',
    
    // Borders
    borderColor: colorTheme.grey,
    borderLight: '#e9ecef',
    divider: '#f0f0f0',
    
    // Chips & Tags
    chipBackground: colorTheme.primary,
    chipText: colorTheme.activeColor,
    activeChipBackground: colorTheme.activeColor,
    activeChipText: colorTheme.activeColor,
    subChipBackground: colorTheme.pallateColor6,
    subChipActiveBackground: colorTheme.grey,
    subChipText: colorTheme.pallateColor5,
    subChipActiveText: colorTheme.white,
    
    // Buttons
    buttonBackground: colorTheme.activeColor,
    buttonText: colorTheme.white,
    primaryBackground: colorTheme.activeColor,
    primaryText: colorTheme.white,
    
    // Icons
    iconColor: colorTheme.grey,
    iconPrimary: '#1a1a1a',
    iconSecondary: '#666',
    navbarIcon: colorTheme.activeColor,
    
    // Brand Colors
    brandPrimary: colorTheme.brandColor,
    brandSecondary: '#007bff',
    
    // Status Colors
    success: '#4CAF50',
    error: '#ff6347',
    warning: '#FFC107',
    info: '#007bff',
    
    // Modal & Overlay
    modalBackground: colorTheme.white,
    overlayBackground: 'rgba(0, 0, 0, 0.5)',
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    
    // Misc
    secondary: colorTheme.grey,
    bottomNavbarItemsopacity: 0,
    shadowColor: '#000',
    placeholder: '#757575',
    disabled: '#F5F5F5',
    
    // Tab Bar
    tabBarBackground: colorTheme.white,
    tabBarActive: '#B61F24',
    tabBarInactive: '#ccc',
    tabIndicator: '#B61F24',
};

const dark = {
    // Navigation & Headers
    navColor: colorTheme.darkPrimary,
    headerThemeBg: colorTheme.darkCard,
    headerThemeText: colorTheme.white,
    
    // Text Colors
    heading: colorTheme.white,
    textColor: colorTheme.lightGrey,
    textPrimary: colorTheme.darkText,
    textSecondary: colorTheme.darkTextSecondary,
    textTertiary: '#808080',
    
    // Backgrounds
    backgroundColor: colorTheme.pallateColor3,
    cardBackground: colorTheme.darkCard,
    surface: colorTheme.darkCard,
    screenBackground: colorTheme.darkSecondary,
    
    // Borders
    borderColor: colorTheme.darkBorder,
    borderLight: '#2a2a2a',
    divider: '#333333',
    
    // Chips & Tags
    chipBackground: colorTheme.pallateColor5,
    chipText: colorTheme.white,
    activeChipBackground: "#4e4e4e",
    activeChipText: colorTheme.white,
    subChipBackground: colorTheme.pallateColor6,
    subChipActiveBackground: colorTheme.grey,
    subChipText: colorTheme.pallateColor5,
    subChipActiveText: colorTheme.white,
    
    // Buttons
    buttonBackground: colorTheme.whiteSmoke,
    buttonText: colorTheme.darkPrimary,
    primaryBackground: '#3a3a3a',
    primaryText: colorTheme.white,
    
    // Icons
    iconColor: colorTheme.grey,
    iconPrimary: colorTheme.darkText,
    iconSecondary: colorTheme.darkTextSecondary,
    navbarIcon: colorTheme.grey,
    
    // Brand Colors
    brandPrimary: '#d32f2f',
    brandSecondary: '#1e88e5',
    
    // Status Colors
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFCA28',
    info: '#42A5F5',
    
    // Modal & Overlay
    modalBackground: colorTheme.darkCard,
    overlayBackground: 'rgba(0, 0, 0, 0.7)',
    overlayDark: 'rgba(0, 0, 0, 0.85)',
    
    // Misc
    secondary: colorTheme.grey,
    bottomNavbarItemsopacity: 0.8,
    shadowColor: '#000',
    placeholder: '#888',
    disabled: '#3a3a3a',
    
    // Tab Bar
    tabBarBackground: colorTheme.darkCard,
    tabBarActive: '#d32f2f',
    tabBarInactive: '#808080',
    tabIndicator: '#d32f2f',
};

export default { light, dark };