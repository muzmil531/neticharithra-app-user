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
    // console.log(screen)
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
    try {
        switch (screenName) {
            case 'MainScreen':
                return require('./../screenHandelers/MainScreen').default;
            case 'IndexScreen':
                return require('./../screenHandelers/IndexScreen').default;
            case 'HomeScreen':
                return require('./../screenHandelers/HomeScreen').default;
            case 'HomePageScreens':
                return require('./../screenHandelers/HomePageScreens').default;

            case 'SearchScreenV2':
                return require('./../screens/Search/SearchScreenV2').default;
            case 'HelpScreen':
                return require('./../screens/HelpScreen').default;
            case 'AllNews':
                return require('./../screens/HomePage/AllNews').default;
            case 'Categorised':
                return require('./../screens/HomePage/Categorised').default;
            case 'NewsContainerV2':
                return require('./../components/NewsContainerV2').default;


            case 'DetailedNewsInfo':
                return require('./../screens/News/detailedNewsInfo').default;


        }
        return assertUnreachableScreen(screenName);
    } catch (error: any) {
        console.error(`Error loading screen "${screenName}":`, error);
        throw new Error(
            `getScreen(...): Failed to load screen "${screenName}" - ${error?.message || 'Unknown error'}`,
        );
    }
}
function assertUnreachableScreen(screenName: never): never {
    throw new Error(
        `getScreen(...): Failed to create screen builder for screen name "${screenName}" - the requested screen was not found.`,
    );
}
