import $$ from '../functions.inc.js';
import { Element } from './main_components.inc.js';

export class Doc {
    constructor({type = 'down', icons = {}}, show_name = false) {
        this.state = this.#doc_down(icons, show_name);
    }

    #events(id) {
        $$.select(`#docs__${id}`).listen('click', e_ => {
            $$.id(`modal__${id}`).removeClass('none-only');
            setTimeout(function(id) {
                $$.id(`modal__${id}`).removeClass('opacity-0');
            }, 500, id);
        });
    }

    #doc_down(icons, show_name) {
        const icons_array = this.#mountDocIcons(icons, show_name);
        
        const doc = new Element('div', {
            id: 'docs__down',
            children: icons_array
        });
    
        new Element('div', {
            id: 'docs__wrap',
            children: [doc],
            appendTo: $$.select('#wrapper').get(0)
        });

        return doc;
    }

    #mountDocIcons(icons, show_name) {
        const icons_array = [];
        Object.keys(icons).map(k => {
            const current = icons[k];
            const icon_children = [];
    
            const icon_text = new Element('p', {
                text: current.name,
                style: 'color: var(--icon-text-color)'
            });
    
            let size = (show_name) ? 'fa-2xl': 'fa-3x';
    
            const icon_image = new Element('i', {
                classes: [current.class, size]
            });
    
            icon_children.push(icon_image);
    
            if(show_name) icon_children.push(icon_text);
    
            const icon = new Element('span', {
                children : icon_children,
                classes: ['icon', 'pointer']
            });
            
            icons_array.push(icon);
        });
    
        return icons_array;
    }

    add(icon, id) {
        const icon_image = new Element('i', {
            classes: [icon.class, 'fa-3x']
        });

        new Element('span', {
            children : [icon_image],
            classes: ['icon', 'pointer'],
            id: `docs__${id}`,
            appendTo: $$.select('#docs__down').get(0)
        });

        this.#events(id);
    }
}

export class Workspace {
    constructor({ icons }, showNames) {
        this.#mount(icons, showNames);
    }

    #mount(icons, show_name) {
        const keys = Object.keys(icons);
        keys.map(k => {
            const current = icons[k];

            const icon_children = [];

            const icon_text = new Element('p', {
                text: current.name,
                style: 'color: var(--icon-text-color)'
            });
    
            let size = (show_name) ? 'fa-2xl': 'fa-3x';
    
            const icon_image = new Element('i', {
                classes: [current.class, size]
            });
    
            icon_children.push(icon_image);
    
            if(show_name) icon_children.push(icon_text);
    
            const icon = new Element('span', {
                children : icon_children,
                classes: ['icon', 'pointer']
            });

            new Element('div', {
                children : [icon],
                attributes: current.attributes,
                classes: ['icon__wrapper'],
                appendTo: $$.select('#wrapper').get(0)
            });
        });
    }
}

export class Modal {
    constructor(id) {
        // Backdrop, Modal
        this.id = id;
        this.#mountModal();
        this.#events();

        return this;
    }

    #destructor() {
        $$.select(`#modal__${this.id} span.modal__header__close__button`).listen('click', _ => {
            $$.transform(this.modal).addClass('opacity-0');
            setTimeout(function(id, modal) {
                $$.select(`#modal__${id}`).addClass('none-only');
                modal.remove();
                $$.id(`docs__${id}`).remove();
            }, 500, this.id, this.modal);
        });
    }

    #maximize_modal() {
        $$.select(`#modal__${this.id} span.modal__header__maximize__button`).listen('click', _ => {
            const modal = $$.transform(this.modal).find('.modal')[0];
            $$.transform(modal).toggleClass('maximized__window');
        });
    }

    #events() {
        this.#destructor();
        this.#hide();
        this.#maximize_modal();
        this.#exit_modal();
    }

    #exit_modal() {
        $$.select(`#modal__${this.id} .modal__backdrop`).listen('click', e => {
            this.#hideActual();
        });
    }

    #hideActual() {
        $$.transform(this.modal).addClass('opacity-0');
        setTimeout(function(modal) {
            $$.transform(modal).addClass('none-only');
        }, 500, this.modal);
    }

    #hide() {
        $$.select('span.modal__header__minimize__button').listen('click', _ => {
            this.#hideActual();
        });
    }

    show() {
        $$.transform(this.modal).style('display: flex');
    }


    #mountBackdrop() {
        return new Element('div', {
            classes: ['modal__backdrop']
        });
    }

    #mountModal() {
        const header = this.#mountHeader();
        const body = this.#mountBody();

        const modal = new Element('div', {
            classes: ['modal'],
            children: [header, body]
        });
        
        this.modal = new Element('div', {
            classes: ['modal__wrapper', 'opacity-0'],
            children: [this.#mountBackdrop(), modal],
            id: `modal__${this.id}`,
            appendTo: $$.select('body').get(0)
        });
        
        setTimeout(function(modal) {
            $$.transform(modal).removeClass('opacity-0');
        }, 100, this.modal);
        
    }

    #close() {
        const btn_close = new Element('span', {
            classes: ['modal__header__close__button']
        });
        
        return btn_close;
    }

    #minimize() {
        return new Element('span', {
            classes: ['modal__header__minimize__button']
        });
    }

    #maximize() {
        return new Element('span', {
            classes: ['modal__header__maximize__button']
        });
    }

    #mountHeader() {
        const buttons = new Element('div', {
            classes: ['modal__header__buttons'],
            children: [
                this.#close(),
                this.#minimize(),
                this.#maximize()                
            ]
        });
        const dragger = new Element('div', {});
        return new Element('div', {
            children: [buttons, dragger],
            classes: ['modal__header']
        });
    }
    #mountBody() {
        return new Element('div', {
            style: 'width: 100%; height: calc(100% - 30px);',
            classes: ['modal__body']
        });
    }

    setIndex(index) { this.id = index; }
    getIndex() { 
        return this.id;
     }
}

export class LoadFolder {
    constructor(index, loader) {
        this.#setIndex(index);
        this.#setLoader(loader);
        this.#loadFolderDetails();
    }

    #setIndex(id) {
        this.id = id;
    }
    getIndex() {
        return this.id;
    }

    #setLoader(loader) {
        this.loader = loader;
    }

    #loadFolderDetails() {
        const loader = this.loader;
        $$.id(`modal__${this.id}`).clear();
        $$.call({
            url: '/workspace/folder',
            method: 'POST',
            body: { url: '/' },
            success: (json) => {
                this.#mountFolderInfo(json);
                loader.remove();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    #mountFolderInfo(json){
        this.workspace_current_route = json.workspace_current_route;
        const $$modal = $$.select(`#modal__${this.id}`).get(0);
        const $$modal_body = $$.transform($$modal).find('.modal__body')[0];

        json.workspace_content.forEach((workspace_item, i) => {
            console.log(workspace_item);
            const item_container = new Element('div', {
                classes: ['workspace__item__container'],
                id: `workspace__item__${i}`,
                appendTo: $$modal_body
            });
        });
    }
}

// End Docs