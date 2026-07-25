import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portal render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
        <h1 className="font-display text-xl font-semibold text-foreground">
          This page could not load
        </h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong while building this page. Nothing you did caused it, and your
          information is safe. Reloading usually clears it.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </div>
      </div>
    );
  }
}
