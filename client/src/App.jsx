import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContextProvider as AuthProvider } from '~/hooks/AuthContext'; 
import { ThemeProvider } from '~/hooks/ThemeContext'; 
import { TooltipProvider } from '~/components/ui/tooltip'; 
import { router } from '~/routes'; 
import store from '~/store/store'; 
import { Provider } from 'react-redux'; 

// Import main CSS
import './style.css'; 

// Initialize React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}> 
            {/* Wrap routes with Auth, Theme, Tooltip contexts */}
            <AuthProvider>
              <ThemeProvider>
                <TooltipProvider>
                  <RouterProvider router={router} />
                </TooltipProvider>
              </ThemeProvider>
            </AuthProvider>
          </Provider>
        </QueryClientProvider>
      </RecoilRoot>
    </Suspense>
  );
}

export default App;
