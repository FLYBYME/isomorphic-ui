import { BrokerComponent } from '../core/BrokerComponent';
import { ComponentChild, IBaseUIProps } from '../types/ui.types';

export interface ErrorBoundaryProps extends IBaseUIProps {
    fallback?: ComponentChild;
}

/**
 * ErrorBoundary — Catches failures in child components and displays a fallback UI.
 */
export class ErrorBoundary extends BrokerComponent {
    private hasError = false;
    private error: Error | null = null;

    constructor(props: ErrorBoundaryProps = {}) {
        super('div', props);
    }

    public build(): ComponentChild | ComponentChild[] {
        if (this.hasError) {
            return (this.props as ErrorBoundaryProps).fallback || `An error occurred: ${this.error?.message}`;
        }
        return this.props.children || [];
    }

    public onMount(): void {
        // We override performUpdate to catch errors during build() or reconcile()
    }

    protected performUpdate(): void {
        try {
            super.performUpdate();
        } catch (err: any) {
            console.error('[ErrorBoundary] Caught error:', err);
            this.hasError = true;
            this.error = err;
            // Force re-render with fallback
            super.performUpdate();
        }
    }
}
