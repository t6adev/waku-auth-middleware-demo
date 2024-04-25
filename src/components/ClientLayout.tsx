'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// WIP Not working yet as expected because of Waku limitation of implementation
function fallbackRender({ error }: { error: any }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  useEffect(() => {
    if (error.statusCode === 401) {
      window.location.href = '/login';
    }
  });
  console.log(error);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>;
};
