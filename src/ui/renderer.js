
import { systemState } from "../store/os-state.js";
import { templateCompiler } from "./ui-utility.js";

import { window_tpl } from "./template/window-tpl.js";
import { wallpaper_tpl } from "./template/wallpaper.js";
import { task_tpl } from "./template/task.js";
import { message_tpl } from "./template/message.js";
import { contexmenu_tpl } from "./template/contexmenu-tpl.js";
import { timer_tpl } from "./template/timer.js";
import { alert_tpl } from "./template/alert-tpl.js";


//window 
const windowView = new Mikado(templateCompiler(window_tpl), {
    recycle: true,
    cache: true
})
export const winbox = {
    view: windowView,
    windows: systemState.window.windows,
    render() {
        this.view.render(this.windows)
    },
}

//Wallpaper
const wallpaperView = new Mikado(templateCompiler(wallpaper_tpl), {
    recycle: true,
    cache: true
})
export const wallpaper_renderer = {
    view: wallpaperView,
    render(){
        this.view.render(systemState.desktop.wallpaper)
    }
}


//Tasklist
const taskbarView = new Mikado(templateCompiler(task_tpl), {
    recycle: true,
    cache: true
})
export const taskbar_renderer = {
    view: taskbarView,
    render(){
        this.view.render(systemState.desktop.taskbar.lists)
    }
}


//Message notiv
const msgView = new Mikado(templateCompiler(message_tpl), {
    recycle: true,
    cache: true
})
export const message_renderer = {
    view: msgView,
    render(){
        this.view.render(systemState.desktop.message)
    }
}


//contexmenu
const cmView = new Mikado(templateCompiler(contexmenu_tpl), {
    recycle: true,
    cache: true
})
export const contextmenu_renderer = {
    view: cmView,
    el: null,
    isHide: true,
    currentContext: null,
    render(){
        this.view.render(systemState.contextmenu.contents)
    },
    show(x, y, data){
      console.log('data:', data)
      if(data){
        systemState.contextmenu.contents = data
        this.render();
      }
      this.el.style.transform = `translate(${x}px, ${y}px)`;
      const bound = window.innerWidth - this.el.getBoundingClientRect().x;
      const width = this.el.offsetWidth
      if (bound < width) {
        this.el.style.transform = `translate(${x - width}px, ${y}px)`;
      }
      this.el.classList.toggle('flip', bound < width * 1.5 )
      this.el.style.visibility = 'visible'
      this.isHide = false
    },
    hide(){
      if(!this.isHide) this.el.style.visibility = 'hidden'
    }
}

//timer
const timerView = new Mikado(templateCompiler(timer_tpl), {
    recycle: true,
    cache: true
})
export const timer_renderer = {
    view: timerView,
    render(){
        this.view.render(systemState.desktop.timer)
    }
}

//alert

export const alert_renderer = {
    view: null,
    $img: null,
    $msg: null,
    render(message,  icon = null){
        systemState.desktop.alert.isOpen = true

        //const content = data.content
        this.$img.src = icon || './assets/img/error.png'
        this.$msg.textContent = message || '[No Data] : this error view'
        this.view.style.display = 'block'
    },
    close(){
        systemState.desktop.alert.isOpen = false;
        this.view.style.display = 'none'
    },
    focus(){
        this.view.style.animation = 'blink .2s infinite'
        setTimeout(()=>{
            this.view.style.animation = ''
        }, 500)
    }
}

export function renderer_init(){
    windowView.mount(document.getElementById('winContainer'));

    wallpaperView.mount(document.getElementById('wallpaper'));
    wallpaper_renderer.render();

    taskbarView.mount(document.querySelector('.nav-task'));
    taskbar_renderer.render();

    msgView.mount(document.querySelector('.nav-messages'));
    message_renderer.render()
    
    timerView.mount(document.querySelector('.timer'));
    timer_renderer.render()

    const $cmContainer = document.getElementById('cmContainer');
    cmView.mount($cmContainer);
    contextmenu_renderer.el = $cmContainer;
    contextmenu_renderer.render()

    //alert
    alert_renderer.view = document.getElementById('window-alert')
    alert_renderer.$img = document.querySelector('.alert-message>div>img')
    alert_renderer.$msg = document.querySelector('.msg>code')


    console.log(
        "%cINIT", "color: lime", "UI: RENDERER"
    )
}
