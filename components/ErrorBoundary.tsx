import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-50 dark:bg-[#050b14] text-zinc-900 dark:text-zinc-300 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Sistem Hatası (System Error)</h1>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya sistem yöneticisine başvurun.
          </p>
          <pre className="bg-zinc-200 dark:bg-white/5 p-4 rounded text-xs text-left overflow-auto max-w-2xl w-full">
            {this.state.error?.message}
          </pre>
          <button
            className="mt-6 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Sistemi Yeniden Başlat (Restart System)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
