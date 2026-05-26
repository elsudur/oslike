
import { runApp } from '../store/os-state.js'
import { eventbus } from '../core/eventbus.js'
import { createSandboxProcess } from '../core/sandbox-process.js'



export async function startApp(appname, customData = null) {
  try {
    if (runApp.has(appname)) {
      const app = runApp.get(appname)
      if (app.isSingleton) {
        //eventbus on -> window-manager
        eventbus.emit("window:focus", app.id)
        return
      }
    }
    const manifestModule = await import(`/src/app/${appname}/manifest.js`)
    if (!manifestModule?.default) throw new Error('manifest fail')
    const manifest = manifestModule.default

    const appEntryModule = await import(manifest.entry);
    if (!appEntryModule?.build) throw new Error(`Entry point 'build' untuk ${appname} tidak ditemukan.`);

    manifest.build = appEntryModule.build;
    manifest.initialData = customData;
    manifest.app = appname; // Amankan ID nama aplikasi

    createSandboxProcess(manifest)
  }
  catch (err) {

    alert(err.stack)
  }
}