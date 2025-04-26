import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AuthContextProvider } from './hooks/AuthContext'; // Adjust path if needed
import { ThemeProvider } from './hooks/ThemeContext'; // Adjust path if needed
import { TooltipProvider } from '~/components/ui/tooltip'; // Ensure correct path
import { router } from './routes'; // Assuming routes.jsx is in the same src directory
import store from './store'; // Assuming Redux store setup
import { Provider } from 'react-redux'; // Import Redux Provider

// Import main CSS
import './style.css'; // Keep if style.css is directly in src

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense for lazy loading */}
      <RecoilRoot>
        <Provider store={store}> {/* Wrap with Redux Provider */}
          <AuthContextProvider>
            <ThemeProvider>
              <TooltipProvider> {/* Ensure TooltipProvider wraps the RouterProvider */}
                {/* Use RouterProvider with the imported router */}
                <RouterProvider router={router} />
              </TooltipProvider>
            </ThemeProvider>
          </AuthContextProvider>
        </Provider>
      </RecoilRoot>
    </Suspense>
  );
}

export default App;
