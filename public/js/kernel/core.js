import $$ from '../lib/functions.inc.js';
import { Element } from '../lib/components/main_components.inc.js';
import { Doc, Workspace, Modal, LoadFolder } from '../lib/components/all.js';

const showNames = false;

const modals = [];

function mountLoader(i, id) {
    const modal_el = $$.id(`modal__${id}`).get();
    const modalBody = $$.transform(modal_el).find('.modal__body')[0];
    const icon = new Element('i', {
        classes: i.split(' '),
    });
    new Element('div', {
        classes: ['loading__screen'],
        children: [icon],
        appendTo: modalBody,
    });
}

function onModal(sType, i, docs) {
    //console.log(sType);
    const id = modals.length + 1;
    const modal = new Modal(id);
    mountLoader(i, id);

    const mDestroyer = $$.id(`modal__${id}`).get();
    const loader = $$.transform(mDestroyer).find('.loading__screen')[0];
    
    switch(sType) {
        case 'folder':
            new LoadFolder(modal.getIndex(), loader, docs);
        break;
        case 'config':
        break;
        case 'shop':
        break;
    }

    modals.push(modal);
}

// Docs
(function() {
    $$
        .tag('body')
        .setAttr('style', 'background-image: url("../img/default-wallpapers/wallpaper_03.jpg")');

    const docs = new Doc({
        type: 'down',
    }, showNames);

    $$.select('body').listen('contextmenu', (e => {
        e.preventDefault();
        //console.log('contextmenu');
    }));
    // Workspace
    const ws = new Workspace({
        icons: {
            'folder': {
                attributes: {
                    'type': 'modal',
                    'secondary-type': 'folder'
                },
                class: 'fa-solid fa-folder',
                name: 'Folder',
                custom_icon: null,
                action: null
            },
            'config': {
                attributes: {
                    'type': 'modal',
                    'secondary-type': 'config'
                },
                class: 'fa-solid fa-gear',
                name: 'Config',
                custom_icon: null,
                action: null,
            },
            'shop': {
                attributes: {
                    'type': 'modal',
                    'secondary-type': 'shop'
                },
                class: 'fa-solid fa-download',
                name: 'Shop',
                custom_icon: null,
                action: null,
            },
        }
    }, showNames);
    // Actions
    $$.select('.icon__wrapper').listen('dblclick', e => {
        const i = $$.transform(e.target.closest('.icon__wrapper')).find('i');
        const className = $$.transform(i).getClasses();
        const type = $$.transform(e.target.closest('.icon__wrapper')).getAttr('type');
        docs.add({
            class: className,
            name: 'Folder',
            custom_icon: null,
            action: null
        }, modals.length + 1);

        switch(type) {
            case 'modal':
                const secondaryType = $$.transform(e.target.closest('.icon__wrapper')).getAttr('secondary-type');
                onModal(secondaryType, className, docs);
            break;
        }
        
    });
})();
