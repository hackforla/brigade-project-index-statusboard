import React from 'react';

type LoadingIndicatorProps = {
  children: JSX.Element;
  loading?: boolean;
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loading,
  children,
}) => {
  if (!loading) return children;
  return <>Loading...</>;
};
