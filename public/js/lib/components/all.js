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
    constructor(index, loader, docs) {
        this.docs = docs;
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

    #getIconFromType(type) {
        let icon = 'fa-solid';
        switch(type) {
            case 'Folder':
                icon += ' fa-folder';
            break;
            case 'Text':
                icon += ' fa-file-lines';
            break;
            case 'Unknown':
            default:
                icon += ' fa-file-circle-question';
            break;
        }
        return `${icon} fa-3x`.split(' ');
    }

    #mountWorkspaceHeader(cRoute) {
        const goBackI = new Element('i', {
            classes: ['fa-solid fa-arrow-left']
        });
        const refreshI = new Element('i', {
            classes: ['fa-solid fa-rotate-left']
        });
        const goBack = new Element('button', {
            classes: ['pointer', 'workspace__goBack'],
            children: [goBackI]
        });
        const refresh = new Element('button', {
            classes: ['pointer', 'workspace__refresh'],
            children: [refreshI]
        });
        const fButtons = new Element('div', {
            classes: ['workspace__header__actions'],
            children: [goBack, refresh]
        });
        const fCRoute = new Element('input', {
            attributes: { disabled: true },
            value: cRoute.replaceAll('//', '/')
        });
        return [fButtons, fCRoute];
    }

    #mountFolderInfo(json){
        this.workspace_current_route = json.workspace_current_route;
        const $$modal_body = $$.select(`#modal__${this.id} .modal__body`).get(0);
        
        $$.select(`#modal__${this.id} .modal__body`).clear();

        const workspace_header = new Element('div', {
            classes: ['workspace__header'],
            appendTo: $$modal_body,
            children: this.#mountWorkspaceHeader(json.workspace_current_route)
        });

        const workspace__container = new Element('div', {
            classes: ['workspace__container'],
            appendTo: $$modal_body
        });

        json.workspace_content.forEach(({ type, name }, i) => {
            const icon = new Element('i', {
                classes: this.#getIconFromType(type)
            });
            new Element('div', {
                attributes: { type: type, title: name, name },
                classes: ['workspace__item__container', 'icon', 'pointer'],
                id: `workspace__item__${i}`,
                children: [icon],
                appendTo: workspace__container
            });
            
        });
        this.#workspace__items__listeners(json.workspace_current_route, json);
    }

    #workspace__items__listeners(cRoute, json) {
        const items = $$.select(`#modal__${this.id} .workspace__container div`);
    
        items.elements.forEach((item, _) => {
            item.addEventListener('dblclick', (evt) => {
                this.#handleDblClick(evt, cRoute);
            });
        });

        const goBackBtn = $$.select(`#modal__${this.id} .workspace__goBack`).get(0).closest('button');
        const refreshBtn = $$.select(`#modal__${this.id} .workspace__refresh`).get(0).closest('button');
        goBackBtn.addEventListener('click', e => {
            const rArray = cRoute.split('/');
            rArray.pop();
            const nRoute = (rArray.length == 1) ? '/' : rArray.join('/');
            $$.call({
                url: '/workspace/folder',
                method: 'POST',
                body: { url: nRoute },
                success: (json) => {
                    this.#mountFolderInfo(json);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        });
        refreshBtn.addEventListener('click', e => {
            $$.call({
                url: '/workspace/folder',
                method: 'POST',
                body: { url: cRoute },
                success: (json) => {
                    this.#mountFolderInfo(json);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        });

        const wp = $$.select(`#modal__${this.id} .workspace__container`).get(0);
        wp.addEventListener('click', e => {
            if($$.select('.context-menu').elements.length > 0) $$.select('.context-menu').get(0).remove();
        });
        wp.addEventListener('contextmenu', e => {
            e.preventDefault();
            
            const item = e.target.closest('.workspace__item__container');
            
            if($$.select('.context-menu').elements.length > 0) $$.select('.context-menu').get(0).remove();
            const ctxtMenu = new Element('ul', {
                classes: ['context-menu'],
                appendTo: $$.select('body').get(0)
            });

            ctxtMenu.style.left = e.pageX + "px"; 
            ctxtMenu.style.top = e.pageY + "px";
            
            const disabled = item === null;

            const options = [
                    {name: 'New folder', attribute: 'new-folder', disabled: false}, 
                    {name: 'New file', attribute: 'new-file', disabled: false}, 
                    {name: 'Remove', attribute: 'remove', disabled}, 
                    {name: 'Rename', attribute: 'rename', disabled}
            ];
            options.forEach((opt, _) => {
                new Element('li', {
                    attributes: { disabled: opt.disabled },
                    classes: ['ctx__option'],
                    id: opt.attribute,
                    text: opt.name,
                    appendTo: ctxtMenu
                });
            });

            this.#workspace__context__listeners(item);
        });
    }

    #workspace__context__listeners(item) {
        // Item: Rename, Remove
        const route = this.workspace_current_route.replaceAll('//', '/');
        const newRoute = (route.length > 1) ? `${route}/` : route;

        $$.select('#new-folder').listen('click', e => {
            $$.select('.context-menu').get(0).remove();
            const label = new Element('label', {
                text: 'A folder name must be provided'
            });
            const input = new Element('input', {
                attributes: { placeholder: 'Provide a name' },
                style: 'width: 50% !important; margin-top: 20px;'
            });
            const buttonAccept = new Element('button', {
                text: 'Create',
                classes: ['btn', 'btn__agree']
            });

            const buttonClose = new Element('button', {
                text: 'Cancel',
                classes: ['btn', 'btn__disagree']
            });

            buttonClose.addEventListener('click', e => {
                e.target.closest('.alert__modal').remove();
            });

            const btn__group = new Element('div', {
                classes: ['btn__group'],
                children: [buttonClose, buttonAccept]
            });
            
            const newFolderAlert = new Alert({
                body: [label, input],
                footer: [btn__group]
            });

            buttonAccept.addEventListener('click', _ => {
                if(input.value.length == 0 || input.value.includes('.')) return input.classList.add('input__wrong');
                input.classList.remove('input__wrong');
                const folderName = input.value.trim();
                
                $$.call({
                    url: '/workspace/create-folder',
                    method: 'POST',
                    body: { url: newRoute, folderName },
                    success: ({code, msg}) => {
                        if(code === 200) {
                            $$.select(`#modal__${this.id} .workspace__refresh`).get(0).click();
                            return newFolderAlert.destroy();
                        }

                        input.classList.add('input__wrong');
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            });
            
        });
        $$.select('#remove').listen('click', e => {
            if(e.target.getAttribute('disabled') === 'true') return;
            $$.select('.context-menu').get(0).remove();
            const type = item.getAttribute('type');
            const name = item.getAttribute('name');
            
            $$.call({
                url: '/workspace/remove-folder',
                method: 'POST',
                body: { url: newRoute, name, type },
                success: ({code, msg}) => {
                    if(code === 200) return $$.select(`#modal__${this.id} .workspace__refresh`).get(0).click();
                },
                error: (error) => {
                    console.error(error);
                }
            });
        });

        $$.select('#new-file').listen('click', e => {
            $$.select('.context-menu').get(0).remove();
            const label = new Element('label', {
                text: 'A file name must be provided with its own extension'
            });
            const input = new Element('input', {
                attributes: { placeholder: 'Provide a name' },
                style: 'width: 50% !important; margin-top: 20px;'
            });
            
            const buttonAccept = new Element('button', {
                text: 'Create',
                classes: ['btn', 'btn__agree']
            });

            const buttonClose = new Element('button', {
                text: 'Cancel',
                classes: ['btn', 'btn__disagree']
            });

            buttonClose.addEventListener('click', e => {
                e.target.closest('.alert__modal').remove();
            });

            const btn__group = new Element('div', {
                classes: ['btn__group'],
                children: [buttonClose, buttonAccept]
            });
            
            const newFileAlert = new Alert({
                body: [label, input],
                footer: [btn__group]
            });

            buttonAccept.addEventListener('click', _ => {
                if(!input.value.includes('.') || input.value.indexOf('.') == 0) {
                    return input.classList.add('input__wrong');
                }
                
                input.classList.remove('input__wrong');
                const fileName = input.value.trim();
                
                $$.call({
                    url: '/workspace/create-file',
                    method: 'POST',
                    body: { url: newRoute, fileName },
                    success: ({code, msg}) => {
                        if(code === 200) {
                            $$.select(`#modal__${this.id} .workspace__refresh`).get(0).click();
                            return newFileAlert.destroy();
                        }

                        input.classList.add('input__wrong');
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            });
        });

        $$.select('#rename').listen('click', e => {
            const type = item.getAttribute('type');
            const type__txt = (type === 'Folder') ? type.toLowerCase()+', no extension can be given' : 'file, name and file extension must be provided';
            $$.select('.context-menu').get(0).remove();
            const label = new Element('label', {
                text: `Rename ${type__txt}: `
            });
            const input = new Element('input', {
                attributes: { placeholder: 'Provide a name' },
                style: 'width: 50% !important; margin-top: 20px;',
                value: item.getAttribute('name')
            });
            
            const buttonAccept = new Element('button', {
                text: 'Create',
                classes: ['btn', 'btn__agree']
            });

            const buttonClose = new Element('button', {
                text: 'Cancel',
                classes: ['btn', 'btn__disagree']
            });

            buttonClose.addEventListener('click', e => {
                e.target.closest('.alert__modal').remove();
            });

            const btn__group = new Element('div', {
                classes: ['btn__group'],
                children: [buttonClose, buttonAccept]
            });
            
            const newFileAlert = new Alert({
                body: [label, input],
                footer: [btn__group]
            });

            buttonAccept.addEventListener('click', _ => {
                if(type != 'Folder' && !input.value.includes('.') || input.value.indexOf('.') == 0) {
                    return input.classList.add('input__wrong');
                }
                if(type == 'Folder' && input.value.includes('.')){
                    return input.classList.add('input__wrong');
                }
                
                input.classList.remove('input__wrong');
                const newName = input.value.trim();
                const oldName = item.getAttribute('name');
                
                $$.call({
                    url: '/workspace/rename',
                    method: 'POST',
                    body: { url: newRoute, newName, type, oldName },
                    success: ({code, msg}) => {
                        if(code === 200) {
                            $$.select(`#modal__${this.id} .workspace__refresh`).get(0).click();
                            return newFileAlert.destroy();
                        }

                        input.classList.add('input__wrong');
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            });
        });
    }

    #handleDblClick(evt, cRoute) {
        const tElement = evt.target.closest('.workspace__item__container');
        const elName = tElement.getAttribute('name');
        const elType = tElement.getAttribute('type');
        
        switch(elType) {
            case 'Text':
                const amountModals = $$.select('.modal').elements.length + 1;
                const amountEditors = $$.select('.modal__editor').elements.length + 1;
                this.docs.add({
                    class: 'fa-solid fa-file-lines',
                    name: 'File',
                    custom_icon: null,
                    action: null
                }, `-${amountEditors}`);
                
                $$.select(`#modal__${this.id} .modal__backdrop`).get(0).click();

                const modal = new Modal(`-${amountEditors}`);

                this.#generateTextEditor(`#modal__-${amountEditors}`, elName);
            break;
            case 'Folder':
                $$.call({
                    url: '/workspace/folder',
                    method: 'POST',
                    body: { url: `${cRoute}/${elName}` },
                    success: (json) => {
                        this.#mountFolderInfo(json);
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            break;
            case 'Unknown':
            break;
            default:
                console.error('Type not defined');
            break;
        } 
    }

    #generateTextEditor(id, fileName) {
        let route = `${this.workspace_current_route}/`.replaceAll('//', '/');
        $$.call({
            url: '/workspace/read-file',
            method: 'POST',
            body: { url: route, fName: fileName },
            success: (json) => {
                const fName = new Element('input', {
                    attributes: { disabled: true },
                    classes: ['workspace__file__editor__fileName'],
                    value: fileName.replaceAll('//', '/'),
                });

                const fileNameDiv = new Element('div', {
                    attributes: { disabled: true },
                    classes: ['workspace__file__editor__fName'],
                    children: [fName],
                    appendTo: $$.select(`${id} .modal__header`).get(0)
                });

                const editor = new Element('textarea', {
                    attributes: { placeholder: 'Write some text and save it with `ctrl-s`' },
                    classes: ['text__editor__textarea'],
                    value: json.content,
                    text: json.content,
                    appendTo: $$.select(`${id} .modal__body`).get(0)
                });
                this.#editorListeners(editor, fileName);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    #editorListeners(editor, fileName) {
        editor.addEventListener('keydown', evt => {
            if ((window.navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey)  && evt.keyCode == 83) {
                // Ctrl+s
                evt.preventDefault();
                let route = `${this.workspace_current_route}/`.replaceAll('//', '/');
                
                $$.call({
                    url: '/workspace/save-file',
                    method: 'POST',
                    body: { url: route, fName: fileName, content: editor.value },
                    success: (_) => {
                        editor.style = 'color: rgb(1, 108, 1)';
                        setTimeout(() => {
                            editor.style = 'color: white';
                        }, 1000);
                    },
                    error: (error) => {
                        console.error(error);
                        editor.style = 'color: #C00';
                        setTimeout(() => {
                            editor.style = 'color: white';
                        }, 1000);
                    }
                });
              }
        });
    }
}

// End Docs

// Start Alert

export class Alert {
    constructor(config){
        this.config = config;
        this.#mountAlert();
    }
    destroy() {
        $$.select(`#${this.id}`).get(0).remove();
    }
    #mountAlert() {
        const id = $$.select('.alert__modal').elements.length + 1;
        this.id = `alert__${id}`;

        const alertBody = new Element('div', {
            classes: ['alert__modal__body'],
            children: this.config.body ?? []
        });

        const alertFooter = new Element('div', {
            classes: ['alert__modal__footer'],
            children: this.config.footer ?? []
        });

        const alertWrap = new Element('div', {
            classes: ['alert__modal__wrapper'],
            children: [alertBody, alertFooter]
        });

        new Element('div', {
            id: this.id,
            classes: ['alert__modal'],
            children: [alertWrap],
            appendTo: $$.select('body').get(0)
        });
    }
}

// End Alert