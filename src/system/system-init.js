import { getStorage } from '../core/data-storage.js'
import { appRegister, actionRegister, contextmenuRegister } from '../core/register.js'
import { win } from '../core/window-engine.js'

import { systemState, userData } from '../store/os-state.js'

import { desktopApp } from '../desktop-app/index.js'






export function system_init(){
  const local_user_data = localStorage.getItem('user-data')
    ? JSON.parse(localStorage.getItem('user-data'))
    : {setup: {wallpaper: './assets/wallpaper/03.jpg'}} //getStorage('user-data')
  Object.assign(userData, local_user_data )

  //set wallpaper 
  systemState.desktop.wallpaper[0].url = userData.setup.wallpaper;

  //window-engine
  actionRegister('window',  win.action)
  contextmenuRegister('window', win.contextmenu)

  //desktop-app
  desktopApp.init()
  desktopApp.startTimer()
  actionRegister('desktop',  desktopApp.action)
  contextmenuRegister('desktop', desktopApp.contextmenu)

}