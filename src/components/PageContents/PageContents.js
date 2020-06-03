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
        <Route path="/" component={Home} exact></Route>
        <Route path="/projects/:id" component={ProjectDetail}></Route>
        <Route path="/projects" component={Projects}></Route>
        <Route path="/brigades" component={Brigades}></Route>
        <Route path="/about" component={About}></Route>
        <Route component={Home}></Route>
        {/* ^ could also do an error page here... */}
      </Switch>
    </div>
  );
}

export default PageContents;
