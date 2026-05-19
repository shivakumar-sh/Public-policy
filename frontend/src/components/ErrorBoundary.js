import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-rose-500 mb-4">Something went wrong</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              An unexpected error has occurred. Please reload the page or try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full py-3"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
