class Functions {
    id(id_selector) {
        this.elements = document.getElementById(id_selector);
        return this;
    }
    tag(tag) {
        this.elements = document.getElementsByTagName(tag);
        return this;
    }
    class(class_str) {
        this.elements = document.getElementsByClassName(class_str);
        return this;
    }
    select(selector) {
        this.elements = [];
        this.elements = document.querySelectorAll(selector);
        return this;
    }
    every(closure) {
        for(let i = 0 ; i < this.elements.length; i++) {
            const current = this.elements[i];
            closure(i, current);
        }
    }
    length() {
        return this.elements.length;
    }
    get(index = null) {
        let values = this.elements;

        if(index != null && typeof index == 'number') {
            values = values[index];
        }

        return values;
    }
    index(n = 0) {
        const current = this.elements[n];
        const parent = current.parentNode;
        const children = parent.children;
        for(let i = 0; i < children.length ; i++) {
            const child = children[i];
            if(child == current) return i;
        }
    }
    getTag(el) {
        return el.tagName.toLowerCase();
    }
    //
    getAttr(attribute, index = 0) {
        return this.elements[index].getAttribute(attribute);
    }
    setAttr(attribute, value, index = 0) {
        const current = this.elements[index];
        current.setAttribute(attribute, value);
    }
    //

    listen(evt, closure) {
        for(let el of this.elements){
            el.addEventListener(evt, closure);
        }
    }

    find(selector) {
        const children = [];
        this.elements.map(el => {
            children.push(el.querySelectorAll(selector)[0]);
        });
        return children;
    }

    transform(element) {
        this.elements = [element];
        return this;
    }

    getClasses(n = 0) {
        if(this.elements[n][0] == undefined) return this.elements[n].getAttribute('class');
        return this.elements[n][0].getAttribute('class');
    }

    hasClass(className, n = 0) {
        return this.elements[n].classList.contains(className);
    }

    removeClass(className, n = 0) {
        if(this.elements[n] != undefined) {
            this.elements[n].classList.remove(className);
        }else {
            this.elements.classList.remove(className);
        }
    }

    addClass(className, n = 0) {
        if(this.elements[n] != undefined) {
            this.elements[n].classList.add(className);
        }else {
            this.elements.classList.add(className);
        }
    }

    toggleClass(className, n = 0) {
        if(this.elements[n].classList.contains(className)) {
            this.removeClass(className);
        }else {
            this.addClass(className);
        }
    }

    style(style, n = 0) {
        if(this.elements[n] != undefined) {
            this.elements[n].style = style;
        }else {
            this.elements.style = style;
        }
    }

    remove(n = 0) {
        if(this.elements[n] != undefined) {
            this.elements[n].remove();
        }else {
            this.elements.remove();
        }
    }

    clear() {
        for(let i = 0 ; i < this.elements.length ; i++) {
            const currentElement = this.elements[i];
            while(currentElement.firstChild) {
                currentElement.removeChild(currentElement.firstChild);
            }
        }
    }

    call({ url, method='post', body, success, error }) {
        fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json'
            },
            headers: { "Content-Type": "application/json" },
            credentials: 'same-origin', // send cookies
        })
            .then(res => res.json())
            .then(success)
            .catch(error);
    }
}
const $$ = new Functions();
export default $$;