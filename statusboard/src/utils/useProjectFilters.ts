import { useContext, useMemo, useState } from "react"
import BrigadeDataContext from "../contexts/BrigadeDataContext";
import { Brigade } from "./types";
import { filterActiveProjects } from "./utils";

type UseProjectFiltersParams = {
  timeRange: [],
  topics: string[],
  brigades: Brigade[]
}

export const useProjectFilters = ({ timeRange, topics, brigades }) => {
  const { allProjects } = useContext(BrigadeDataContext);

  const projectsFilteredByTime = useMemo(() => {
    return filterActiveProjects(allProjects, { timeRange })
  }, [timeRange])

  return {
    projectsFilteredByTime,
    projectsFilteredByTopics,
    projectsFilteredByBrigades
  }
}