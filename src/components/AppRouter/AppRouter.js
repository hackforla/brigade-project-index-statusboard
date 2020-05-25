import React from 'react';
import { BrowserRouter } from 'react-router-dom';

function AppRouter({ children }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )  
}

export default AppRouter;
