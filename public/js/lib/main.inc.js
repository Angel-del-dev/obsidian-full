export default class MainComponent {
    constructor() {
        
    }
    /*
        * Main function
    */
    mount(tag, config) {
        this.element = document.createElement(tag);

        this.#createTextNode(config.text);
        this.#addClasses(config.classes);
        this.#addId(config.id);
        this.#editable(config.editable);
        this.#style(config.style);
        this.#value(config.value);
        this.#attributes(config.attributes);
        this.#children(config.children);

        // ---------------Always last functionalities---------------
        this.#putEvents(config.events, config.events_immediate);

        if(config.appendTo != undefined && config.appendTo != '' && config.appendTo != null) this.appendTo(config.appendTo);
        // ---------------------------------------------------------
        return this.element;
    }

    #putEvents(events, immediate = false) {
        if(typeof events != 'function') return false;
        this.events = events;

        if(immediate) this.callEvents();
    }
    /*
     * Check functions
     */
    #isFullEmpty(prop, type) {
        if(prop == null) return true;
        if(type.includes(',')) {
            if(type.includes(typeof prop)) {
                
                const split = type.split(',');
                split.map(t => {
                    const v = this.#isFullEmpty(prop, t);
                    if(v) return v;
                });
            }
        }
        switch(type) {
            case 'undefined':
                return true;
            case 'string':
                if(prop.replace(' ', '').length == 0)  return true;
                break;
            case 'array':
                if(prop.length == 0) return true;
                break;
            case 'object':
                if(Object.keys(prop).length == 0) return true;
                break;
        }

        return false;
    }

    /*
     * Formatting functions
     */
    callEvents() {
        if(typeof this.events == 'function') this.events();
    }
    #createTextNode (text) {
        if(this.#isFullEmpty(text, 'string')) return false;
        this.element.append(document.createTextNode(text));
    }
    #addClasses(classes) {
        if(this.#isFullEmpty(classes, 'array')) return false;
        this.element.setAttribute('class', classes.join(' '));
    }
    #addId(id) {
        if(this.#isFullEmpty(id, 'string')) return false;
        this.element.setAttribute('id', id);
    }

    #editable(editable) {
        if(typeof editable != 'boolean') return false;
        this.element.setAttribute('contenteditable', editable);
    }

    #style(style) {
        if(this.#isFullEmpty(style, 'string')) return false;
        this.element.style = style;
    }

    #value(value) {
        if(this.#isFullEmpty(value, 'string,integer')) return false;
        this.element.setAttribute('value', value);
    }

    #attributes(attributes) {
        if(this.#isFullEmpty(attributes, 'object')) return false;
        Object.keys(attributes).map(k => {
            if(this.#isFullEmpty(attributes[k], 'string,integer')) return true;
            this.element.setAttribute(`${k}`, attributes[k]);
        });
    }

    #children(children) {
        if(children == undefined || children == null || children == '') return false;
        children.map(child => {
            this.element.append(child);
        });
    }
}