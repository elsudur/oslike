


export function build(api){
  api.mount(api.html`
<div><div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 250px">
    <h2 class="instruction instruction-primary">Loading data...</h2>
    <div role="progressbar" class="marquee"></div>
</div></div>
    `)
  
  api.timeout(()=>{
    api.mount(api.html`
<div>
    <section class="menu-bar">
        <ul role="menubar">
            <li role="menuitem" tabindex="0">File</li>
            <li role="menuitem" tabindex="0">Edit</li>
            <li role="menuitem" tabindex="0">View</li>
            <li role="menuitem" tabindex="0">Help</li>
        </ul>
    </section>
    <section class="function-bar">
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/remote-desktop.png">
            <span>Back</span>
        </div>
        <div class="separate"></div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/hdd.png">
            <span>Back</span>
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/hdd.png">
            <span>Back</span>
        </div>
        <div class="separate"></div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/copy.png">
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/paste.png">
        </div>
        <div class="separate"></div>
    </section>
    <section class="function-bar small">
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/paste.png">
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/paste.png">
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/paste.png">
        </div>
        <div class="separate"></div>
        <div class="btn">
            <img src="https://img.icons8.com/color/30/000000/paste.png">
        </div>
    </section>
    <div class="window-content has-scrollbar"></div>
</div>
      `)
  }, 60000)
}