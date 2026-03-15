import { z } from 'zod';
import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';
export declare const TypographySchema: z.ZodObject<{
    variant: z.ZodDefault<z.ZodEnum<["h1", "h2", "h3", "h4", "h5", "h6", "body", "caption", "code"]>>;
    textAlign: z.ZodOptional<z.ZodEnum<["left", "center", "right", "justify"]>>;
    weight: z.ZodOptional<z.ZodEnum<["light", "normal", "medium", "bold"]>>;
    text: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    variant: "body" | "caption" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    textAlign?: "justify" | "center" | "left" | "right" | undefined;
    weight?: "light" | "normal" | "medium" | "bold" | undefined;
    text?: string | undefined;
}, {
    variant?: "body" | "caption" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined;
    textAlign?: "justify" | "center" | "left" | "right" | undefined;
    weight?: "light" | "normal" | "medium" | "bold" | undefined;
    text?: string | undefined;
}>;
export type TypographyProps = IBaseUIProps & z.infer<typeof TypographySchema>;
/**
 * Typography Primitive — Semantic text rendering.
 */
export declare class Typography extends BrokerComponent {
    private static TagMap;
    constructor(props: TypographyProps);
    protected applyDOMProps(props: TypographyProps): void;
    build(): ComponentChild;
}
