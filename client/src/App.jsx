import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider } from './hooks/AuthContext'; // Adjust path if needed
import { ThemeProvider } from './hooks/ThemeContext'; // Adjust path if needed
import { TooltipProvider } from '~/components/ui/tooltip'; // Ensure correct path
import { router } from './routes'; // Assuming routes.jsx is in the same src directory
import store from './store/store'; // Use configured store instance
import { Provider } from 'react-redux'; // Import Redux Provider

// Import main CSS
import './style.css'; // Keep if style.css is directly in src

// Initialize React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense for lazy loading */}
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}> {/* Wrap with Redux Provider */}
            {/* Router context must wrap AuthContextProvider */}
            <RouterProvider router={router}>
              <AuthContextProvider>
                <ThemeProvider>
                  <TooltipProvider>
                    {/* Routes render here by RouterProvider */}
                  </TooltipProvider>
                </ThemeProvider>
              </AuthContextProvider>
            </RouterProvider>
          </Provider>
        </QueryClientProvider>
      </RecoilRoot>
    </Suspense>
  );
}

export default App;
