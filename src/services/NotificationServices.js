import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  console.log(`Attempting to navigate to: ${name}`, params);
  
  if (navigationRef.isReady()) {
    console.log('Navigation is ready, navigating now');
    navigationRef.navigate(name, params);
  } else {
    console.log('Navigation not ready, waiting...');
    // Retry after a short delay if navigation isn't ready
    const maxRetries = 10;
    let retries = 0;
    
    const interval = setInterval(() => {
      retries++;
      console.log(`Retry attempt ${retries}/${maxRetries}`);
      
      if (navigationRef.isReady()) {
        console.log('Navigation ready after retry, navigating now');
        navigationRef.navigate(name, params);
        clearInterval(interval);
      } else if (retries >= maxRetries) {
        console.error('Navigation failed: Max retries reached');
        clearInterval(interval);
      }
    }, 300);
  }
}
