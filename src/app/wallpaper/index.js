




export function build(api){

  api.mount(api.html`
<div>
<section class="sunken-panel">
    <div style="margin-bottom: 10px;">
        <img class="wall_img" src="assets/img/image.png"
            style="object-fit: cover;width: 300px; height: 170px;" />
        <span class="wall_load loader animate" aria-label="Processing"
            style="position: absolute;top: 40%;left: 50%;transform: translate(-50%, -50%);visibility: hidden;"></span>
    </div>
    <div style="display: flex">
        <input class="wall_url" type="search" placeholder="URL" style="flex: 1;" autocomplete="wallpaper_url"/>
    </div>
</section>
<section style="display: flex; justify-content: flex-end; gap: 6px; margin-top: 10px;margin-right:5px">
    <button class="btn-icon">
        <img src="https://img.icons8.com/color/18/000000/door.png">
    </button>
    <button class="btn-icon btn-paste">
        <img src="https://img.icons8.com/color/18/000000/paste.png">
    </button>
    <button class="btn-preview" >Preview</button>
    <button class="btn-apply">Save</button>
</section>
<div>`)

  const $loading = api.query('.wall_load')
  const $input = api.query('.wall_url')
  const $img = api.query('.wall_img')
  const $btn_preview = api.query('.btn-preview')
  const $btn_apply = api.query('.btn-apply')

  api.addEvent($btn_preview, 'click', ()=> {
    const url = $input.value.trim();
    if (!url.startsWith('https://')) return;
    preload($loading, $img,true)
    const img = new Image();
    img.src = url;
    img.onload = () => {
        $img.src = url;
        preload($loading, $img);
    };
    img.onerror = () => {
        alert("URL Gambar tidak valid atau tidak ditemukan.");
        preload($loading, $img);
    };
  })


  //BURUK => akses document
  api.addEvent($btn_apply, 'click', () => {
    const url = $input.value.trim();
    document.querySelector('#wallpaper img').src = url
    const storage = localStorage.getItem('user-data') ? JSON.parse(localStorage.getItem('user-data')) : {setup:{}}
    storage.setup.wallpaper = url;
    localStorage.setItem('user-data', JSON.stringify(storage))
  })
}

function preload($loading, $img, status = false){
  $img.style.visibility = status ? 'hidden' : 'visible';
  $loading.style.visibility = status ? 'visible' : 'hidden';
}



