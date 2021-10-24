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
  loading: boolean;
};

const BrigadeDataContext = createContext<BrigadeDataContextType>({
  allBrigadeData: [],
  allProjects: [],
  allTopics: [],
  loading: false,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      if (!brigadeData.length) {
        setLoading(true);
        const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
        const _brigadeData = brigades.data;
        setBrigadeData(_brigadeData);
        const _projects = getProjectsFromBrigadeData(_brigadeData);
        // if(_projects) {
        //   for (let i = 0; i < _projects.length; i++) {
        //     _projects[i].last_pushed_within_number =  
        //       periodToNumber(_projects[i].last_pushed_within!);
        //   }
        // }
        setProjects(_projects || []);
        setTopics(getTopicsFromProjects(_projects));
      }
      setLoading(false);
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
        loading,
      }}
    >
      {childNodes}
    </Provider>
  );
};

export { BrigadeDataContextProvider };
export { Consumer as BrigadeDataConsumer };
export default BrigadeDataContext;
