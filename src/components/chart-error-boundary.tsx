'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconRefresh, IconAlertTriangle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className='@container/card'>
          <CardHeader>
            <CardTitle className='text-destructive flex items-center gap-2'>
              <IconAlertTriangle className='h-5 w-5' />
              {this.props.title || 'Chart Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center py-8 text-center'>
            <div className='text-muted-foreground mb-4 text-sm'>
              Something went wrong while loading this chart.
            </div>
            <div className='text-muted-foreground mb-6 max-w-md text-xs'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <Button
              onClick={this.handleRetry}
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              <IconRefresh className='h-4 w-4' />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Empty state component for charts with no data
export function ChartEmptyState({
  title = 'No Data Available',
  description = "There's no data to display in this chart right now.",
  action
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className='@container/card'>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='text-muted-foreground mb-2 text-lg font-medium'>
          {title}
        </div>
        <div className='text-muted-foreground mb-6 max-w-md text-sm'>
          {description}
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
