import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps } from '../types/ui.types';

export interface ImageProps extends IBaseUIProps {
    src: string;
    alt?: string;
    lazy?: boolean;
}

/**
 * Image primitive — Standardized image with lazy-loading and logging.
 */
export class Image extends BrokerComponent {
    constructor(props: ImageProps) {
        super('img', props);
    }

    public build() {
        return [];
    }

    protected applyDOMProps(props: ImageProps): void {
        super.applyDOMProps(props);
        if (!this.element) return;

        const img = this.element as HTMLImageElement;
        img.src = props.src;
        if (props.alt) img.alt = props.alt;
        if (props.lazy !== false) img.loading = 'lazy';

        img.onerror = () => {
            console.error(`[Image] Failed to load: ${props.src}`);
            // In a real app, we'd use the app.logger if available
        };
    }
}
