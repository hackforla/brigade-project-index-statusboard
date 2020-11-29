import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import {
  getBaseApiUrl,
  getProjectsFromBrigadeData,
  getTopicsFromProjects,
} from '../utils/utils';
import { Brigade, Project } from '../utils/types';

type BrigadeDataContextType = {
  allBrigadeData: Brigade[];
  allProjects: Project[];
  allTopics: string[];
};

const BrigadeDataContext = createContext<BrigadeDataContextType>({
  allBrigadeData: [],
  allProjects: [],
  allTopics: [],
});

const { Provider, Consumer } = BrigadeDataContext;

const BrigadeDataContextProvider = ({
  children: childNodes,
}: {
  children: JSX.Element;
}) => {
  const [brigadeData, setBrigadeData] = useState<Brigade[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (!brigadeData.length) {
        const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
        const _brigadeData = brigades.data;
        setBrigadeData(_brigadeData);
        const _projects = getProjectsFromBrigadeData(_brigadeData);
        setProjects(_projects);
        setTopics(getTopicsFromProjects(_projects));
      }
    };
    getData();
    // Disabling bc brigade data length isn't going to change outside of this hook
    // eslint-disable-next-line
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
