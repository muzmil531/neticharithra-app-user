

const colorTheme = {
    primary: "#C4DAFE",
    white: '#FFFFFF',
    whiteSmoke: "#f5f5f5",
    grey:"grey",
    lightGrey:"#C4C7C5",
    activeColor: "#442EB7",
    black: "black",



    // darkmode
    darkPrimary: "#1A1A1A",
    darkGrey: "#202020",
    pallateColor3: "#262626",
    pallateColor4: "#2C2C2C",
    pallateColor5: "#333333",
    pallateColor6:"#D9D9D9"
        // "#A9A9A9"
};

const light = {
    navColor: colorTheme.white,
    heading: colorTheme.black,
    textColor: colorTheme.grey,
    borderColor: colorTheme.grey,
    backgroundColor: colorTheme.whiteSmoke,
    chipBackground: colorTheme.primary,
    chipText: colorTheme.activeColor,
    navbarIcon: colorTheme.activeColor,
    activeChipBackground: colorTheme.activeColor,
    activeChipText: colorTheme.activeColor,
    buttonBackground: colorTheme.activeColor,
    buttonText: colorTheme.white,
    iconColor: colorTheme.grey,
    secondary:colorTheme.grey,
    subChipBackground:colorTheme.pallateColor6,
    subChipActiveBackground: colorTheme.grey,
    subChipText: colorTheme.pallateColor5,
    subChipActiveText:colorTheme.white,
    bottomNavbarItemsopacity:0
    
};

const dark = {
    navColor: colorTheme.darkPrimary,
    heading: colorTheme.white,
    textColor: colorTheme.lightGrey,
    borderColor: colorTheme.whiteSmoke,
    backgroundColor: colorTheme.pallateColor3,
    chipBackground: colorTheme.pallateColor5,
    chipText: colorTheme.white,
    navbarIcon: colorTheme.grey,
    activeChipBackground: "#4e4e4e",
    activeChipText: colorTheme.white,
    buttonBackground: colorTheme.whiteSmoke,
    buttonText: colorTheme.darkPrimary,
    iconColor: colorTheme.grey,
    subChipBackground: colorTheme.pallateColor6,
    subChipActiveBackground: colorTheme.grey,
    subChipText: colorTheme.pallateColor5,
    subChipActiveText: colorTheme.white,
    bottomNavbarItemsopacity:0.8

};

export default { light, dark };