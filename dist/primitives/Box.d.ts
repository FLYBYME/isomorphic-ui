import { z } from 'zod';
import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';
export declare const BoxSchema: z.ZodObject<{
    fill: z.ZodOptional<z.ZodBoolean>;
    children: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    children?: any;
    fill?: boolean | undefined;
}, {
    children?: any;
    fill?: boolean | undefined;
}>;
export type BoxProps = IBaseUIProps & z.infer<typeof BoxSchema>;
/**
 * Box Primitive — The foundational layout atomic.
 */
export declare class Box extends BrokerComponent {
    constructor(props: BoxProps);
    protected applyDOMProps(props: BoxProps): void;
    build(): ComponentChild | ComponentChild[];
}
