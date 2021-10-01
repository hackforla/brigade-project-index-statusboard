import React from 'react';
import cx from 'classnames';
import { Cell, Column } from 'react-table';
import { Button, TextFilter } from '../../components';
import { Project } from '../../utils/types';
import { Filter } from '../../utils/useProjectFilters';

function projectGitHubCellLink(cell: Cell<Project>): JSX.Element {
  const project = cell.row.original;
  // TODO: CHANGE THIS WHEN WE HAVE A PROJECT DETAIL PAGE TO GO TO
  // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
  return <a href={project.code_url}>{project.name}</a>;
}

function projectWebsiteCellLink(cell: Cell<Project>): JSX.Element {
  const project = cell.row.original;
  if(project.link_url) {
    return <a target='new' href={project.link_url}>website</a>;
  }
  return <span/>;
}

function projectOpenIssuesCell(cell: Cell<Project>): JSX.Element {
  const project = cell.row.original;
  if(project.open_issues_within) {
    const issues = project.open_issues_within;
    // let issuestxt = "1 - 10";
    // console.log(issues);
    // if(issues === "100") {
      // issuestxt = "10 - 100";
      // console.log("100 issues");
    // }
	// return <span>{issuestxt}</span>;
    return <span>{issues}</span>;
  }
  return <span/>;
}

function topicsCellButtons(
  topics: string[] = [],
  setFilters: (newFilter: Filter) => void,
) {
  // eslint-disable-next-line react/display-name
  return ({ row }: Cell<Project>): JSX.Element => {
    const project = row.original;
    return (
      <>
        {(project.topics || []).map((t: string) => (
          <Button
            className={cx('tag-link', {
              'tag-link--active': topics?.sort().includes(t),
            })}
            key={`${project.name}-${t}`}
            linkButton
            disabled={false} // TODO: convert components to ts
            // eslint-disable-next-line react/no-children-prop
            children={undefined}
            text={t}
            onClick={() => setFilters({ topics: [t] })}
          />
        ))}
      </>
    );
  };
}

export default function getTableColumns(
  filterTopics: string[] = [],
  setFilterTopics: (newFilter: Filter) => void,
): Column<Project>[] {
  return [
    {
      Header: 'Project',
      accessor: 'name',
      Filter: TextFilter,
      filter: 'fuzzyTextFilter',
      Cell: projectGitHubCellLink,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Filter: TextFilter,
      filter: 'fuzzyTextFilter',
    },
    {
      Header: 'Website',
      id: 'website',
      Cell: projectWebsiteCellLink,
    },
    {
      Header: 'Open Issues',
      id: 'open-issues',
      Cell: projectOpenIssuesCell,
    },
    {
      Header: 'Topics',
      id: 'topics',
      accessor: (project: Project) => project.topics?.length,
      disableFilters: true,
      Cell: topicsCellButtons(filterTopics, setFilterTopics),
    },
    {
      Header: 'Brigade',
      accessor: (project: Project) => project.brigade?.name,
      id: 'organization',
      Filter: TextFilter,
      filter: 'fuzzyTextFilter',
    },
  ];
}
