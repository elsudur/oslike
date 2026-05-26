
import { systemState, actionRegistry, contextmenuRegistry } from '../store/os-state.js'
import { Drag } from '../core/dragJs.js'
import { eventbus } from '../core/eventbus.js'

import { contextmenu_renderer, alert_renderer } from './renderer.js'


function toContext(target) {
    const el = target.closest('.onclick, .window-body, .window');
    if (!el) return systemState.context = 'desktop';
    systemState.context = el.classList.contains('window') ? 'window' : el.dataset.context;
}

export function mousedown_handling(e) {
    //if(e.button !== 0) return;
    const target = e.target;
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
    
    toContext(target)
    const cm = target.closest('#cmContainer');
    if (cm) return
    contextmenu_renderer.hide()

    const movement = target.dataset.movement;
    if (!movement) return;
    const win = target.closest('.window')


    // on -> /window-manager.js
    eventbus.emit('window:focus', win.dataset.id)


    if( movement !== 'table'){
        if(win.hasAttribute('fullscreen')) return
    }

    if (e.cancelable) e.preventDefault();

    Drag.dragObject.name = `.${movement}`;
    Drag.mousedownHandler(u(target), e);
}

export async function click_handling(e) {
    const el = e.target
    if (['INPUT', 'TEXTAREA'].includes(el.tagName)) return;
    const { action, args } = el.dataset;

    //debug:
    console.log("%cC:", "color: lime", systemState.context, action, args)

    
    if (!action) return
    const runAction = actionRegistry[systemState.context]?.[action]
    if (typeof (runAction) === 'function') {
        try {
            await runAction(args)
        }
        catch (err) {
            console.log(err.message, err.stack)
            alert_renderer.render(err.stack)
        }
        finally {
            contextmenu_renderer.hide()
        }
    }
}

export function contexmenu_handling(e) {
    e.preventDefault();
    if(systemState.desktop.alert.isOpen) return alert_renderer.focus()
    
    const $target = e.target;
    const cm = systemState.context //$target.dataset.cm;

    //debug:
    console.log("%cCM:", "color: lime", systemState.context, cm)

    if (!cm || !contextmenuRegistry[cm]) return
    const { clientX: x, clientY: y } = e;
    const isHold = contextmenu_renderer.currentContext == cm;
    const list = isHold ? false : contextmenuRegistry[cm]
    contextmenu_renderer.show(x, y, list);
    contextmenu_renderer.currentContext = cm
}



document.addEventListener('fullscreenchange', () => {
    const toggle = u('#fullscreen_view').nodes[0];
    if (!document.fullscreenElement) {
        toggle.checked = false;
    } else {
        toggle.checked = true;
    }
});

export function event_init() {
    Drag.init(u('.dragContainer'))
    document.body.addEventListener('mousedown', mousedown_handling);
    document.body.addEventListener('touchstart', mousedown_handling, { passive: false });

    document.body.addEventListener('click', click_handling);
    document.body.addEventListener('contextmenu', contexmenu_handling);
}