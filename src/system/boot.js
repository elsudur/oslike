

import { renderer_init } from '../ui/renderer.js'
import { event_init } from '../ui/event.js'
import { system_init } from '../system/system-init.js'



export function boot(){
  renderer_init();
  event_init()
  system_init()
  
}