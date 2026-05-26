
import { processRuntime } from '../store/os-state.js'
import { createSandboxAPI } from './sandbox-api.js';
import { win } from'./window-engine.js'

function createLifecycle(){
  return {
    mount: null,
    destroy: null,
    suspend: null,
    resume: null
  }
}

export function createSandboxProcess(meta){
  const pid = ++processRuntime.pid
  const wid = 'win-' + pid

  //contrac
  const process = {
    pid, wid,
    singleton: meta.singleton,
    name: meta.name,
    state: 'created',
    mounted: false,
    node: null,
    body: null,
    cleanup: [],
    events: Object.create(null),
    memory: Object.create(null),
    permissions: [...(meta.permission || [])],
    lifecycle: createLifecycle()
  }

  processRuntime.pool[wid] = process

  try{
    const windowInstance = win.create(meta, wid);
    process.node = windowInstance.node
    process.body = windowInstance.body

    const api = createSandboxAPI(process, meta.initialData);
    meta.build(api);
    process.state = 'running';
    return process
  }
  catch(err){
    process.state = 'error'
    if (process.node) {
      process.node.innerHTML = '';
      process.node.remove();
    }
    delete processRuntime.pool[pid]
    console.error(
      '[Process Mount Error]',
      process.name,
      err
    )
    return null
  }
}