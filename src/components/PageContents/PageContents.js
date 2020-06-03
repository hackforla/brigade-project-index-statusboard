import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../../pages/Home';
import About from '../../pages/About';
import Projects from '../../pages/Projects';
import ProjectDetail from '../../pages/ProjectDetail';
import Brigades from '../../pages/Brigades/Brigades';
import './PageContents.css';

function PageContents() {
  return (
    <div className="contents">
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/projects" component={Projects} />
        <Route path="/brigades" component={Brigades} />
        <Route path="/about" component={About} />
        <Route component={Home} />
        {/* ^ could also do an error page here... */}
      </Switch>
    </div>
  );
}

export default PageContents;
