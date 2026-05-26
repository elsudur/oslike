
import { eventbus } from './eventbus.js'
import { systemState, processRuntime, runApp } from '../store/os-state.js'
import { winbox } from '../ui/renderer.js'
import { desktopApp } from '../desktop-app/index.js'
import { getIndex, getWindow, getNode, getCurrentId, getCurrentWindow } from './window-utility.js'

const windows = systemState.window.windows;
const windowRuntime = systemState.window.runtime;


const createControl = (opt, id) => {
    if (!opt?.length) return [];
    const btn = []
    for (let i = 0; i < opt.length; i++) {
        btn.push({ label: opt[i], action: opt[i].toLowerCase(), args: id })
    }
    return btn
}



function create(meta, id = null) {
    const winType = meta.type ?? 'app';
    const icon = meta.icon ?? 'virtualbox';
    const wid = id ?? crypto.randomUUID();

    const windowState = {
        id: wid,
        app: meta.app,
        type: winType,
        iconUrl: icon.startsWith('https://') ? icon : `https://img.icons8.com/color/18/000000/${icon}.png`,
        title: meta.title ?? wid,
        isResize: meta.isResize ? 'resizeHandle' : 'resizeHandle d-none',
        className: 'window active',
        control: createControl(meta.control, wid),
    }
    if (windows.length > 0) {
        windows.some(w => {
            if (w.className === 'window active') {
                w.className = 'window'
                return true
            }
        })
    }
    windows.push(windowState);
    winbox.render()

    const index = windows.length - 1;
    const node = winbox.view.node(index);
    node.style.zIndex = systemState.window.z++;

    //dimensi
    const { width, height } = meta;
    node.style.width = width ? width + 'px' : '400px';
    node.style.height = height ? height + 'px' : '400px';
    const transform_x = Math.round((window.innerWidth / 2) - ((width ?? 400) / 2))
    const transform_y = Math.round((window.innerHeight / 2) - ((height ?? 400) / 2))
    node.style.transform = `translate(${transform_x}px, ${transform_y}px)`;

    const body = node.querySelector('.window-body');
    body.dataset.context = windowState.app;

    if (winType === 'app') {
        desktopApp.taskbar.add({
            app: windowState.app,
            id: windowState.id,
            title: windowState.title,
            iconUrl: windowState.iconUrl,
        })
        runApp.set(meta.singleton ? windowState.app : windowState.id, { id: windowState.id, isSingleton: meta.singleton });
    }
    else if (winType === 'viewer' && meta.template) {
        body.innerHTML = meta.template;
    }

    recentFocusId = windowState.id;
    windowRuntime.history.push(windowState.id)
    windowRuntime.track[windowState.id] = { index }

    return {
        //id,
        node,
        body
    }
}

function pushFocus(id) {
    const history = windowRuntime.history
    const clean = history.filter(i => i !== id)
    clean.push(id)
    history.length = 0
    history.push(...clean)
}

let recentFocusId = null;
function focusWindow(id) {
    if (!id) return
    if (recentFocusId === id) return
    const currentIndex = getIndex(id)
    if (currentIndex < 0) return
    const current = windows[currentIndex]
    if (!current) return

    const lastId = getCurrentId()

    if (lastId) {
        const last = getWindow(lastId)
        if (last) last.className = 'window'
    }

    current.className = 'window active'
    recentFocusId = id
    pushFocus(id)

    winbox.render()

    const node = getNode(id)
    if (node) node.style.zIndex = systemState.window.z++
}

//emit-> event-handling.js
eventbus.on("window:focus", focusWindow)

function deleteWindow(id = null) {

    const winId = id ? id : getCurrentId()
    if (!winId) return
    const index = getIndex(winId)
    if (index < 0) return

    const targetWindow = windows[index];
    const process = processRuntime.pool[winId];

    // Interseptor Data Proxy isDirty
    if (targetWindow.type === 'app' && process?.isDirty) {
        if (!confirm("Data belum disimpan. Tetap tutup?")) return;
    }

    const domNode = winbox.view.node(index);

    windows.splice(index, 1)
    delete windowRuntime.track[winId]

    Object.keys(windowRuntime.track)
        .forEach(key => {
            const item = windowRuntime.track[key]
            if (item.index > index) item.index--
        })

    // clean history
    const cleanHistory = windowRuntime.history.filter(i => i !== winId)
    windowRuntime.history.length = 0
    windowRuntime.history.push(...cleanHistory)

    // activate last
    const lastId = getCurrentId()
    if (lastId) {
        const last = getWindow(lastId)
        if (last) last.className = 'window active'
    }
    else {
        systemState.window.z = 1
    }

    winbox.render()

    if (targetWindow.type === 'app') {
        desktopApp.taskbar.remove(winId);
        if (process) {
            runApp.delete(process.singleton ? process.name : process.wid);
            process.state = 'destroying';
            for (let i = 0; i < process.cleanup.length; i++) {
                process.cleanup[i]();
            }
            process.cleanup = [];
            delete processRuntime.pool[id];
        }
    }

    if (domNode) {
        console.log('domNode dihancurkan!')
        domNode.innerHTML = "";
        domNode.remove();
    }

}


function toggleFullScreen(id) {
    const { winId, node } = winNodeById(id)
    if (!node) return

    const runtime = windowRuntime.track[winId]

    runtime.fullscreen ??= {
        active: false,
        backup: null
    }

    const fs = runtime.fullscreen
    if (!fs.active) {
        fs.backup = {
            transform: node.style.transform,
            width: node.style.width,
            height: node.style.height,
            marginTop: node.style.marginTop
        }

        Object.assign(node.style, {
            transform: 'unset',
            width: '100vw',
            height: 'calc(100vh - 30px)',
            marginTop: '30px'
        })
    }
    else {
        Object.assign(node.style, fs.backup)
    }

    fs.active = !fs.active
    node.toggleAttribute('fullscreen')
}


function toggleShow(id, action) {
    const { winId, node } = winNodeById(id)
    if (!node) return
    const runtime = windowRuntime.track[winId]
    runtime.visibility ??= {
        hidden: false,
        transform: ''
    }

    const state = runtime.visibility
    if (action === 'hide') {
        state.hidden = true
        state.transform = node.style.transform
        Object.assign(node.style, {
            transform: 'translateY(-100vh)',
            opacity: '0',
            visibility: 'hidden',
            transition: 'transform .3s ease, opacity .3s ease, visibility .3s ease'
        })
        const lastId = getPreviousFocusable(winId)
        if (lastId) focusWindow(lastId)
    }
    if (action === 'show') {
        if (state.hidden) {
            state.hidden = false
            Object.assign(node.style, {
                transform: state.transform,
                opacity: '',
                visibility: '',
                transition: 'transform .3s ease, opacity .3s ease'
            })

            setTimeout(() => {
                node.style.transition = ''
            }, 300)
        }
        focusWindow(winId)
    }
}


function winNodeById(id = null) {
    const winId = id ? id : getCurrentId()
    if (!winId) return {}
    const index = getIndex(winId)
    if (index < 0) return {}
    return {
        winId,
        index,
        node: winbox.view.node(index)
    }
}

function getPreviousFocusable(id) {
    const history = windowRuntime.history

    for (let i = history.length - 1; i >= 0; i--) {
        const winId = history[i]
        // skip current
        if (winId === id) continue
        const runtime = windowRuntime.track[winId]

        // sudah dihapus
        if (!runtime) continue

        // hidden
        if (runtime.visibility?.hidden) continue

        return winId
    }

    return null
}

const contextmenu = [
    {
        label: 'Minimize',
        action: 'minimize',
        icon: 'minimize-window'
    },
    {
        label: 'Maximize/Restore',
        action: 'maximize',
        icon: 'maximize-window'
    },
    {
        label: 'Close',
        icon: 'close-window'
    },
]

const action = {
    help: () => {
        alert('FOO')
    },
    close: (id) => {
        deleteWindow(id)
    },
    minimize: (id) => {
        toggleShow(id, 'hide')
    },
    show: (id) => {
        toggleShow(id, 'show')
    },
    maximize: (id) => {
        toggleFullScreen(id)
    },
    restore: (id) => {
        toggleFullScreen(id)
    }
}

export const win = { create, action, contextmenu }

window.__history = windowRuntime.history