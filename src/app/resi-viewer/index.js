import { template } from './tpl.js'

export function build(api) {
  api.mount(template)
  const $content = api.query('.window-content');
  $content.innerHTML = resiDetail(api.data)

  const $input = api.query('.input-search')
  const $btn_search = api.query('.btn-search')
  const $btn_close = api.query('.btn-close')
  const $btn_preview = api.query('.btn-preview')
  const $btn_armada = api.query('.btn-armada')
  api.addEvent($btn_search, 'click', async () => {
    console.log('cechResi')
    const resi = $input.value;
    const result = await cechResi(api, resi)
    $content.innerHTML = resiDetail(result)
    console.log(result)
    api.data.lastSearc = resi
  })

  api.addEvent($btn_close, 'click', api.close)
  api.addEvent($btn_preview, 'click', () => {
    api.windowCreate({
      app: 'preview',
      type: 'viewer',
      title: 'preview image pod',
      control: ['Close'],
      template: '<h2>This New Window</h2>'
    })
  })
  api.addEvent($btn_armada, 'click', () => {
    api.callApp('armada')
  })
}

function resiDetail(data) {

  return `<p>${JSON.stringify(data, null, 2)}</p>`
}

async function cechResi(api, noresi) {
  console.log(noresi)
  const rsp = await api.fetch('https://bo.sentralcargo.co.id/api/resiinfo/' + noresi);
  const rspJson = await rsp.json();
  return rspJson
}