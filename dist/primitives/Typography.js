"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typography = exports.TypographySchema = void 0;
const zod_1 = require("zod");
const BrokerComponent_1 = require("../core/BrokerComponent");
exports.TypographySchema = zod_1.z.object({
    variant: zod_1.z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'code']).default('body'),
    textAlign: zod_1.z.enum(['left', 'center', 'right', 'justify']).optional(),
    weight: zod_1.z.enum(['light', 'normal', 'medium', 'bold']).optional(),
    text: zod_1.z.string().optional(),
});
/**
 * Typography Primitive — Semantic text rendering.
 */
class Typography extends BrokerComponent_1.BrokerComponent {
    constructor(props) {
        const validated = exports.TypographySchema.parse(props);
        super(Typography.TagMap[validated.variant] || 'p', props);
    }
    applyDOMProps(props) {
        super.applyDOMProps(props);
        if (!this.element)
            return;
        this.element.classList.add('mesh-text');
        this.element.classList.add(`mesh-text--${props.variant || 'body'}`);
        if (props.textAlign)
            this.element.style.textAlign = props.textAlign;
        if (props.weight)
            this.element.style.fontWeight = `var(--mesh-font-weight-${props.weight})`;
    }
    build() {
        return this.props.text || '';
    }
}
exports.Typography = Typography;
Typography.TagMap = {
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
    body: 'p', caption: 'span', code: 'code'
};
