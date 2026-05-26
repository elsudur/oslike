import { appRegistry, actionRegistry, contextmenuRegistry } from '../store/os-state.js'

export function appRegister(meta){
  if(!meta?.app) return;
  const app  = meta.app;
  if(appRegistry[app]) return;
  appRegistry[app] = meta;
}

export function actionRegister(name, action){
  if(!name || !action) return;
  if(actionRegistry[name]) return;
  actionRegistry[name] = action;  
}

export function contextmenuRegister(name, list){
  if(!name || !list) return;
  if(contextmenuRegistry[name]) return;
  contextmenuRegistry[name] = createItemList(name, list)
}

function createItemList( context, lists ) {
    const result = [];
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        const isNested = list.child;
        const action = list.action ? list.action : list.label.toLowerCase()
        const args = list.args ? list.args : ''
        result.push({
            label: list.label,
            iconUrl: list.icon ? `https://img.icons8.com/color/18/000000/${list.icon}.png` : '',
            iconClass: list.icon ? '' : 'd-none',
            context,
            action: isNested ? '' : action,
            args: isNested ? '' : args,
            class: list.divider ? 'has-divider' : '',
            disabled: list.disabled ? true : false,
            popup: isNested ? true : false,
            child: list.child?.length ? createItemList(context, list.child) : [],
            ulClass: isNested ? '' : 'd-none',
        })

    }
    return result
}