import React from 'react';
import AppRouter from '../AppRouter/AppRouter';
import Header from '../Header/Header';
import PageContents from '../PageContents/PageContents';
import { BrigadeDataContextProvider } from '../../contexts/BrigadeDataContext';
import Footer from '../Footer/Footer';

function App() {
  return (
    <div className="App">
      <BrigadeDataContextProvider>
        <AppRouter>
          <Header />
          <PageContents />
          <Footer />
        </AppRouter>
      </BrigadeDataContextProvider>
    </div>
  );
}

export default App;
