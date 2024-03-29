/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/extensions */
import React from 'react';
import cx from 'classnames';
import { Cell } from 'react-table';
import { Button } from '../../components';
import { Project, ExtendedColumn } from '../../utils/types';
import { Filter } from '../../utils/useProjectFilters';

function projectGitHubCellLink(cell: Cell<Project>): JSX.Element {
  const project = cell.row.original;
  // TODO: CHANGE THIS WHEN WE HAVE A PROJECT DETAIL PAGE TO GO TO
  // <NavLink to={`/projects/${slugify(project.slug)}`}>{project.name}</NavLink>
  let html = (
    <a href={project.code_url} target="new" rel="noreferrer">
      {project.name}
    </a>
  );
  if (project.link_url) {
    html = (
      <div style={{ display: 'flex' }}>
        <a title="Repo" href={project.code_url} target="new">
          {project.name}
        </a>
        <a
          title="Live site"
          style={{ marginLeft: '12px' }}
          target="new"
          href={project.link_url}
        >
          <img alt="Website" src="www-icon.png" width="18" height="18" />
        </a>
      </div>
    );
  }
  return html;
}

function projectOpenIssuesCell(cell: Cell<Project>): JSX.Element {
  const project = cell.row.original;
  if (project.open_issues_within) {
    let issuestxt = '1 - 10';
    const issues = project.open_issues_within;
    if (issues === 100) {
      issuestxt = '10 - 100';
    }
    if (issues === 1000) {
      issuestxt = '100 - 1000';
    }
    return (
      <span>
        <span className="hide-column-label">Open issues: </span>
        {issuestxt}
      </span>
    );
  }
  return <span />;
}

function topicsCellButtons(
  topics: string[] = [],
  setFilters: (newFilter: Filter) => void
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
  filterTags: string[] = [],
  setFilterTags: (newFilter: Filter) => void
): ExtendedColumn<Project>[] {
  return [
    {
      Header: 'Project',
      accessor: 'name',
      disableFilters: true,
      Cell: projectGitHubCellLink,
      extendedClassName: 'name-column',
    },
    {
      Header: 'Description',
      accessor: 'description',
      disableFilters: true,
      extendedClassName: 'description-column',
    },
    {
      Header: 'Open Issues',
      id: 'open-issues',
      accessor: (project: Project) => project.open_issues_within,
      Cell: projectOpenIssuesCell,
      sortType: 'customStringSort',
      disableFilters: true,
      extendedClassName: 'open-issues-column',
    },
    {
      Header: 'Last Push',
      id: 'last-pushed-within',
      disableFilters: true,
      accessor: 'last_pushed_within',
      sortType: 'lastPushSort',
      extendedClassName: 'last-pushed-within-column',
    },
    {
      Header: 'Tags',
      id: 'topics',
      accessor: (project: Project) => project.topics?.length,
      disableFilters: true,
      Cell: topicsCellButtons(filterTags, setFilterTags),
      disableSortBy: true,
      extendedClassName: 'topics-column',
    },
    {
      Header: 'Organization',
      accessor: (project: Project): string => project.brigade?.name ?? '',
      id: 'organization',
      sortType: 'customStringSort',
      disableFilters: true,
      extendedClassName: 'organization-column',
    },  
  ];
}
