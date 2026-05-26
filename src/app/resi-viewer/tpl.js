
export const template = `
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
            <img src="https://img.icons8.com/color/remote-desktop.png">
            <span>Back</span>
        </div>
        <div class="separate"></div>
        <div class="btn">
            <img src="https://img.icons8.com/color/hdd.png">
            <span>Back</span>
        </div>
        <div class="btn btn-armada">
            <img src="https://img.icons8.com/color/truck.png">
            <span>Back</span>
        </div>
        <div class="separate"></div>
        <div class="btn">
            <img src="https://img.icons8.com/color/copy.png">
        </div>
        <div class="btn btn-preview">
            <img src="/assets/img/image.png">
        </div>
        <div class="separate"></div>
        <div class="btn btn-close">
            <img src="https://img.icons8.com/color/close-window.png">
        </div>
    </section>
    <section class="function-bar small">
        <div class="btn">
            <img src="https://img.icons8.com/color/paste.png">
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/paste.png">
        </div>
        <div class="btn">
            <img src="https://img.icons8.com/color/paste.png">
        </div>
        <div class="separate"></div>
        <div class="btn" >
            <img src="https://img.icons8.com/color/search.png">
        </div>
        <div class="separate"></div>
        <div class="searchbox">
            <input class="input-search" type="search" placeholder="Search">
            <button class="btn-search" aria-label="search"></button>
        </div>
    </section>
    <div class="window-content has-scrollbar"></div>
</div>
`