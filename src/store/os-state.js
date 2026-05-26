export const systemState = {
  context: null,
  desktop: {
    wallpaper: [{ url: '' }],
    taskbar: {
      track: Object.create(null),
      running: Object.create(null),
      lists: []
    },
    message: {
      icon: './assets/img/message.png',
      messages: []
    },
    timer: [{
      date: 'setup time...',
      hour: '00',
      minute: '00',
      second: '00',
    }],
    alert: {
      isOpen: false
    }
  },
  window: {
    z: 1,
    runtime: {
      history: [],
      track: Object.create(null)
    },
    windows: []
  },
  contextmenu: {
    contents: []
  }
};

export const runApp = {
  _apps: new Map(),
  set: (name, wid) => runApp._apps.set(name, wid),
  has: (name) => runApp._apps.has(name),
  get: (name) => runApp._apps.get(name),
  delete: (name) => runApp._apps.delete(name)
};

export const processRuntime = {
  pid: 0,
  pool: Object.create(null),
}

window.__runApp = runApp
window.__processRuntime = processRuntime

export const actionRegistry = Object.create(null);

export const appRegistry = Object.create(null)

export const contextmenuRegistry = Object.create(null)

export const userData = Object.create(null)

export const data_temp = Object.create(null)