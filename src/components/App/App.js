import React from 'react';
import AppRouter from '../AppRouter/AppRouter';
import Header from '../Header/Header';
import PageContents from '../PageContents/PageContents';

function App() {
  return (
    <div className="App">
      <AppRouter>
        <Header />
        <PageContents />
      </AppRouter>
    </div>
  );
}

export default App;
