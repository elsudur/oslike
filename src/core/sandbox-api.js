
import { startApp } from '../system/launcher.js'
import { win } from './window-engine.js'

export function createSandboxAPI(process, initialData) {

  //const node = process.node
  const body = process.body;
  const activeRequests = new Set();

  process.cleanup.push(() => {
    for (const controller of activeRequests) {
      controller.abort();
    }
    activeRequests.clear();
  });

  const savedState = JSON.parse(localStorage.getItem(`os_store_${process.name}`)) || {};
  process.isDirty = false;
  const trackedData = new Proxy(initialData ?? {}, {
    set(target, prop, value) {
      if (target[prop] !== value) {
        target[prop] = value;
        process.isDirty = true;
        localStorage.setItem(`os_store_${process.name}`, JSON.stringify(target));
      }
      return true;
    }
  });

  function on(event, handler) {
    if (!process.events[event]) {
      process.events[event] = []
    }
    process.events[event].push(handler)
  }
  function emit(event, payload) {
    const stack = process.events[event]
    if (!stack) return
    for (let i = 0; i < stack.length; i++) {
      stack[i](payload)
    }
  }
  function mount(html) {
    body.innerHTML = html
  }
  function html(strings, ...values) {
    let out = ''
    for (let i = 0; i < strings.length; i++) {
      out += strings[i] + (values[i] || '')
    }
    return out
  }
  function css(el, styleObj) {
    for (const key in styleObj) {
      el.style[key] = styleObj[key]
    }
  }
  function query(selector) {
    return body.querySelector(selector)
  }
  function queryAll(selector) {
    return body.querySelectorAll(selector)
  }
  function addEvent(target, type, handler, options) {
    target.addEventListener(type, handler, options)
    process.cleanup.push(() => {
      target.removeEventListener(type, handler, options)
    })
  }
  function interval(callback, interval) {
    const id = setInterval(callback, interval)
    process.cleanup.push(() => {
      clearInterval(id)
    })
    return id
  }
  function timeout(callback, timeout) {
    const id = setTimeout(callback, timeout)
    process.cleanup.push(() => {
      clearTimeout(id)
    })
    return id
  }
  function store(key, value) {
    process.memory[key] = value
  }
  function load(key) {
    return process.memory[key]
  }
  function close() {
    //destroyProcess(process.wid)
    win.action.close(process.wid)
  }

  //fetch

  async function fetch_sandbox(url, options = {}) {
    const controller = new AbortController();
    const { signal } = controller;

    activeRequests.add(controller);
    const fetchOptions = { ...options, signal };

    try {
      const resp = await fetch(url, fetchOptions)
      return resp
    }
    catch (err) {
      if (err.name === 'AbortError') {
        console.log(`[Fetch Aborted] HTTP Request ke ${url} dihentikan.`);
        return new Promise(() => { }); // Meredam .then() di level aplikasi
      }
      throw err;
    }
    finally {
      activeRequests.delete(controller);
    }
  }


  //window
  function windowCreate(cfg) {
    win.create(cfg)
  }

  //call other app
  function callApp(name, option) {
    startApp(name, option)
  }
  return {
    pid: process.pid,
    wid: process.wid,

    body, mount, html, css, query, queryAll, addEvent, interval, timeout,
    store, load, emit, on, close,

    //interaction
    windowCreate, callApp,

    //passing proxy data
    data: trackedData,

    //fetch
    fetch: fetch_sandbox
  }
}
