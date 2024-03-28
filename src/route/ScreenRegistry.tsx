import React from 'react';

type ScreenName =
    | 'News'
    // | 'OnBoarding'
    // | 'Login'
    // | 'SignUp'
    // | 'Sidebar'
    // | 'Dashboard'
    // | 'LeaveManagement'
    // | 'Summary'

type ScreenType = React.ComponentType<any>;
type ScreenBuilderType = () => ScreenType;

let screenBuilderRegistry = new Map<ScreenName, ScreenBuilderType>();
/**
 * Returns a function for lazily loading a screen.
 */
export function getScreenBuilder(screen: ScreenName, parent: any): ScreenBuilderType {
    if (!screenBuilderRegistry.has(screen)) {
        let cached: ScreenType | null = null;
        const builder = () => {
            if (cached === null) {
                const start = global.performance.now();
                // 

                cached = getScreen(screen, parent);
                if (typeof cached === 'function') {
                    cached = React.memo(cached);
                }

                const end = global.performance.now();
                console.log(
                    `😄 Lazily registered Screen "${screen}" in ${end - start}ms!`,
                );
            }
            return cached;
        };
        screenBuilderRegistry.set(screen, builder);
    }

    return screenBuilderRegistry.get(screen);
}

function getScreen(screenName: any, parent: any): ScreenType {

    switch (screenName) {
        case 'HomeScreen':
            return require('./../screenHandelers/HomeScreen').default;
        case 'SearchScreen':
            return require('./../screenHandelers/SearchScreen').default;
        case 'News':
            return require('./../screens/News/News').default;
        case 'SpecificDistrict':
            return require('./../screens/News/SpecificDistrict').default;
        
    }
    return assertUnreachableScreen(screenName);
}
function assertUnreachableScreen(screenName: never): never {
    throw new Error(
        `getScreen(...): Failed to create screen builder for screen name "${screenName}" - the requested screen was not found.`,
    );
}
