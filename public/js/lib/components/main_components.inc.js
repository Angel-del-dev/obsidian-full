import MainComponent from '../main.inc.js';
import $$ from '../functions.inc.js';

export class Element extends MainComponent{
    constructor(tag, config = {}) {
        super();
        this.element = this.mount(tag, config);
        return this.element;
    }

    appendTo(el) {
        el.append(this.element);
        this.callEvents();
    }
}

export const BodyEl = $$.select('body').get(0);