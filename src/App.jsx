import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Display from "./components/Homepage";
import CrudOperations from './components/Crud';
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <div className="App">
        <CrudOperations />
          <Display />
        </div>
      </QueryClientProvider>
  );
}

export default App;