import { systemState } from '../store/os-state.js'
import { createDigitalClock } from './timer.js'
import { search } from './search.js'

import { win } from '../core/window-engine.js'
import { alert_renderer, taskbar_renderer } from '../ui/renderer.js'

//test app sandbox
import { startApp } from '../system/launcher.js'



const APP_NAME = 'desktop'
const metaapp = {
  app: APP_NAME,
  title: 'Desktop Environment'
}

const ctxmenu = [
  {
      label: 'Refresh',
      child: [
          {
              label: 'Now',
              divider: true
          },
          {
              label: 'Next',
              disabled: true
          }
      ]
  },
  {
      label: 'Open',
      icon: 'virtualbox',
      disabled: true,
      divider: true,
      child: [
          {
              label: 'Now',
              divider: true
          },
          {
              label: 'Next',
              disabled: true
          }
      ]
  },
  {
      label: 'Refresh',
      icon: 'refresh',
  },
  {
      label: 'Reload',
      divider: true,
  }
]

const action ={
  runapp: (appName) => {
    startApp(appName)
  },
  reload: () => {
    location.reload();
  },
  search: async () => {
    const resi = search.element.$input.value;
    const result = await search.searching(resi)
    console.log(result)

    startApp('resi-viewer', result)
  },
  close: (type) => {
    if(type === 'alert') alert_renderer.close()
  },
  focus: (type) => {
    if(type === 'alert') alert_renderer.focus()
  }
}

//timer
function startTimer(){
    const t = systemState.desktop.timer[0]
    const clock = createDigitalClock();
    clock.start((data) => {
        t.date = data.tanggal
        t.hour = data.jam
        t.minute = data.menit
        t.second = data.detik
    });
}

//taskbar
const taskbar = {
  _getState() {
    return systemState.desktop.taskbar;
  },

  add(meta) {
    const { lists, running, track } = this._getState();
    const runningApp = running[meta.app];

    if (runningApp) {
      const listItem = lists[runningApp.index];
      listItem.child.push({ ...meta });
    } else {
      running[meta.app] = {
        index: lists.length
      };
      lists.push({ 
        class: "task-item active", 
        iconUrl: meta.iconUrl, 
        child: [{ ...meta }] 
      });
    }

    track[meta.id] = { app: meta.app };
    
    taskbar_renderer.render();
  },

  remove(id) {
    const { lists, running, track } = this._getState();
  
    if (!track[id]) return; 
    const { app } = track[id];
    
    const runningApp = running[app];
    if (!runningApp) return;

    const listIndex = runningApp.index;
    const listItem = lists[listIndex];

    listItem.child = listItem.child.filter(c => typeof c === 'object' ? c.id !== id : c !== id);
    delete track[id];

    if (listItem.child.length === 0) {
      lists.splice(listIndex, 1);
      delete running[app];

      for (const key in running) {
        if (running[key].index > listIndex) {
          running[key].index--;
        }
      }
    }

    taskbar_renderer.render();
  }
};

function init(){
  search.element.$input = document.getElementById('input-search-dekstop');
  search.element.$loading = document.getElementById('searchloading')
}

export const desktopApp = {
  init,
  meta: metaapp,
  action,
  contextmenu: ctxmenu,
  startTimer,
  taskbar
}