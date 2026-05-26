import { systemState } from '../store/os-state.js'
import { winbox } from '../ui/renderer.js'

const windows = systemState.window.windows
const runtime = systemState.window.runtime

export function getIndex(id) {
    return runtime.track[id]?.index ?? -1
}

export function getWindow(id) {
    const index = getIndex(id)
    return windows[index]
}

export function getNode(id) {
    const index = getIndex(id)

    if (index < 0) return null

    return winbox.view.node(index)
}

export function getCurrentId() {
    return runtime.history.at(-1)
}

export function getCurrentWindow() {
    return getWindow(getCurrentId())
}