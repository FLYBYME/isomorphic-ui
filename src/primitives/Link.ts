import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';

export interface LinkProps extends IBaseUIProps {
    href: string;
}

/**
 * <Link> — Imperative navigation wrapped in a reactive anchor tag.
 */
export class Link extends BrokerComponent {
    constructor(props: LinkProps) {
        super('a', props);
    }

    protected applyDOMProps(props: LinkProps): void {
        super.applyDOMProps(props);
        if (!this.element) return;

        const anchor = this.element as HTMLAnchorElement;
        anchor.href = props.href;
        
        anchor.onclick = (e: MouseEvent) => {
            e.preventDefault();
            this.navigate(props.href);
        };
    }

    private navigate(path: string): void {
        if (typeof window === 'undefined') return;

        // 1. Update browser history
        window.history.pushState({}, '', path);

        // 2. Dispatch event to trigger RouterModule
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    public build(): ComponentChild | ComponentChild[] {
        return (this.props as LinkProps).children || [];
    }
}
