import { RouterProvider } from 'react-router-dom';
import { Router } from './router';
import { QueryProvider } from '@/providers/QueryProvider';
import { UserProvider } from '@/providers/UserProvider';
import { Toaster } from '@/components/ui/toast';

const App = () => (
  <QueryProvider>
    <UserProvider>
      <RouterProvider router={Router} />
      <Toaster />
    </UserProvider>
  </QueryProvider>
);

export default App;
