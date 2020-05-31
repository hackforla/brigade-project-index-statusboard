export function getBaseApiUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  // TODO: WHAT SHOULD THIS RETURN?
  return '';
}
