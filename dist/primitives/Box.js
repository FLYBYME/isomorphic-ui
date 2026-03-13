"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = exports.BoxSchema = void 0;
const zod_1 = require("zod");
const BrokerComponent_1 = require("../core/BrokerComponent");
exports.BoxSchema = zod_1.z.object({
    fill: zod_1.z.boolean().optional(),
    children: zod_1.z.any().optional(),
});
/**
 * Box Primitive — The foundational layout atomic.
 */
class Box extends BrokerComponent_1.BrokerComponent {
    constructor(props) {
        // Validate specific Box props, pass rest to base
        const validated = exports.BoxSchema.parse(props);
        super(props.tagName || 'div', props);
    }
    applyDOMProps(props) {
        super.applyDOMProps(props);
        if (props.fill && this.element) {
            this.element.classList.add('mesh-box--fill');
        }
        if (!this.element?.classList.contains('mesh-box')) {
            this.element?.classList.add('mesh-box');
        }
    }
    build() {
        return this.props.children || [];
    }
}
exports.Box = Box;
