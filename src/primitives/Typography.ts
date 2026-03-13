import { z } from 'zod';
import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';

export const TypographySchema = z.object({
    variant: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'code']).default('body'),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
    weight: z.enum(['light', 'normal', 'medium', 'bold']).optional(),
    text: z.string().optional(),
});

export type TypographyProps = IBaseUIProps & z.infer<typeof TypographySchema>;

/**
 * Typography Primitive — Semantic text rendering.
 */
export class Typography extends BrokerComponent {
    private static TagMap: Record<string, string> = {
        h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
        body: 'p', caption: 'span', code: 'code'
    };

    constructor(props: TypographyProps) {
        const validated = TypographySchema.parse(props);
        super(Typography.TagMap[validated.variant] || 'p', props);
    }

    protected applyDOMProps(props: TypographyProps): void {
        super.applyDOMProps(props);
        if (!this.element) return;

        this.element.classList.add('mesh-text');
        this.element.classList.add(`mesh-text--${props.variant || 'body'}`);
        if (props.textAlign) this.element.style.textAlign = props.textAlign;
        if (props.weight) this.element.style.fontWeight = `var(--mesh-font-weight-${props.weight})`;
    }

    public build(): ComponentChild {
        return (this.props as TypographyProps).text || '';
    }
}
