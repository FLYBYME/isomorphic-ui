"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const Box_1 = require("./Box");
/**
 * Stack Primitive — Vertical layout helper.
 */
class Stack extends Box_1.Box {
    constructor(props) {
        super({
            direction: 'col',
            gap: 'md',
            ...props
        });
    }
    applyDOMProps(props) {
        super.applyDOMProps(props);
        if (props.isDivided) {
            this.element?.classList.add('mesh-stack--divided');
        }
    }
}
exports.Stack = Stack;
