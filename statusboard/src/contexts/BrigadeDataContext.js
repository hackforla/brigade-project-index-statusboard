import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import {
  getBaseApiUrl,
  getProjectsFromBrigadeData,
  getTopicsFromProjects,
} from '../utils';

const BrigadeDataContext = createContext({
  allBrigadeData: [],
  allProjects: [],
  allTopics: [],
});

const { Provider, Consumer } = BrigadeDataContext;

const BrigadeDataContextProvider = ({ children: childNodes }) => {
  const [brigadeData, setBrigadeData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      const _brigadeData = brigades.data;
      setBrigadeData(_brigadeData);
      const _projects = getProjectsFromBrigadeData(_brigadeData);
      setProjects(_projects);
      setTopics(getTopicsFromProjects(_projects));
    };
    getData();
  }, []);

  return (
    <Provider
      value={{
        allBrigadeData: brigadeData,
        allProjects: projects,
        allTopics: topics,
      }}
    >
      {childNodes}
    </Provider>
  );
};

export { BrigadeDataContextProvider };
export { Consumer as BrigadeDataConsumer };
export default BrigadeDataContext;
