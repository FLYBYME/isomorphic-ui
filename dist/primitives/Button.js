"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const BrokerComponent_1 = require("../core/BrokerComponent");
/**
 * Button Primitive — Interactive atomic.
 */
class Button extends BrokerComponent_1.BrokerComponent {
    constructor(props) {
        super('button', props);
    }
    applyDOMProps(props) {
        super.applyDOMProps(props);
        if (!this.element)
            return;
        this.element.classList.add('mesh-button');
        if (props.variant)
            this.element.classList.add(`mesh-button--${props.variant}`);
        // Event delegation note: 
        // For a single button, we use direct listener, but for lists we'd use delegation.
    }
    build() {
        return this.props.children || this.props.text || 'Button';
    }
}
exports.Button = Button;
