let start: number | null = null;
let isLaunched = false;

export function onAppBeginLaunch() {
    if (start !== null) {
        return;
    }
    start = global.performance.now();
}

export function onAppEndLaunch() {
    if (start === null) {
        throw new Error(
            'Start was null! Did you forget to call onAppBeginLaunch() at the top of your index.js?',
        );
    }
    if (isLaunched) {
        return;
    }
    isLaunched = true;
    const end = global.performance.now();
    
}
