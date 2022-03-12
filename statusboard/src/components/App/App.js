import React from 'react';
import AppRouter from '../AppRouter/AppRouter';
import Header from '../Header/Header';
import PageContents from '../PageContents/PageContents';
import { BrigadeDataContextProvider } from '../../contexts/BrigadeDataContext';
import Footer from '../Footer/Footer';
import { TaxonomyDataContextProvider } from '../../contexts/TaxonomyDataContext';

function App() {
  return (
    <div className="App">
      <TaxonomyDataContextProvider>
      <BrigadeDataContextProvider>
        <AppRouter>
          <Header />
          <PageContents />
          <Footer />
        </AppRouter>
      </BrigadeDataContextProvider>
      </TaxonomyDataContextProvider>
    </div>
  );
}

export default App;
