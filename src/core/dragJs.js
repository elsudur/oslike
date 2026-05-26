



//TWEAK method .css() in Umberella as jQueary-like
u.prototype.css = function (name, value) {
    // Pastikan ada elemen yang diproses
    if (!this.nodes.length) return (arguments.length === 1 && typeof name === 'string') ? undefined : this;

    // GETTER
    if (arguments.length === 1 && typeof name === 'string') {
        const style = window.getComputedStyle(this.nodes[0]);
        return style.getPropertyValue(name) || style[name];
    }

    // SETTER
    return this.each(function (node) {
        if (typeof name === 'object') {
            for (let key in name) node.style[key] = name[key];
        } else {
            node.style[name] = value;
        }
    });
};
//========================



export const Drag = {
    isLoad: false,
    $mask: null,
    _moveHandler: null,
    _upHandler: null,
    initialDragState: { name: '', win: null, isDrag: false, isMove: false },
    dragObject: {},
    raf: null,
    cooldown: 0,

    init($parent) {
        if (!this.isLoad) {
            this.isLoad = true;
            this.dragObject = { ...this.initialDragState };
            const css = `
            <style>
                #mask-window { 
                    visibility: hidden; position:absolute; top:0; left:0; z-index:9999;
                    cursor:grabbing; border: 2px dashed #ccc; pointer-events: none;
                    box-sizing: border-box;
                }
            </style>`;
            u('head').append(css);
            this.$mask = u('<div id="mask-window"></div>');
            $parent.append(this.$mask);
            console.log("%cINIT", "color: lime", "CORE: DRAG LIB"
)
        }
    },

    matrixTranslate(matrixString) {
        if (!matrixString || matrixString === 'none') return { x: 0, y: 0 };
        const match = matrixString.match(/matrix.*\((.+)\)/);
        if (!match) return { x: 0, y: 0 };
        const matrix = match[1].split(', ');
        return { x: parseFloat(matrix[4]), y: parseFloat(matrix[5]) };
    },

    mousedownHandler($base, e) {
        let d = this.dragObject;
        if (!d.name) return;

        const isTouch = e.type === 'touchstart';
        const coords = isTouch ? e.touches[0] : e;
        d.isDrag = true;
        d.startX = coords.clientX;
        d.startY = coords.clientY;
        
        //console.log('isTouch:', isTouch)

        if (d.name === '.table') {
            d.win = $base.closest('table');
            d.win.css('cursor', 'col-resize');
            d.th = d.win.css('grid-template-columns').split(' ');
            d.index = $base.closest('th').nodes[0].cellIndex;
            d.initialSize = parseFloat(d.th[d.index]);
        } else {
            d.win = $base.closest('.window');


            const point = this.matrixTranslate(d.win.css('transform'));
            const node = d.win.nodes[0];
            const wWidth = node.offsetWidth;
            const wHeight = node.offsetHeight;

            Mikado.setStyle(this.$mask.nodes[0], {
                visibility: 'visible',
                width: wWidth + 'px',
                height: wHeight + 'px',
                transform: `translate(${point.x}px, ${point.y}px)`,
                "will-Change": 'transform'
            });

            const isDragType = d.name === '.drag';
            d.initialX = isDragType ? point.x : wWidth;
            d.initialY = isDragType ? point.y : wHeight;

            d.minWidth = 300; d.minHeight = 150;
            d.maxWidth = window.innerWidth - 50 //- (isDragType ? wWidth : 0);
            d.maxHeight = window.innerHeight - 50//- (isDragType ? wHeight : 0);
        }

        
        
        this._moveHandler = (ev) => {
            if (ev.cancelable) ev.preventDefault();
            this.mousemoveHandler(ev)
        };
        this._upHandler = () => this.mouseupHandler(isTouch);

        if (isTouch) {
            u(document).on('touchmove', this._moveHandler, { passive: false });
            u(document).on('touchend', this._upHandler);
        } else {
            u(document).on('mousemove', this._moveHandler);
            u(document).on('mouseup', this._upHandler);
        }
    },

    mousemoveHandler(e) {
        //console.log("move")
        if (this.raf) return
        this.raf = requestAnimationFrame(() => {
            try {
                if(this.cooldown) return this.cooldown--
                this.cooldown = 3
                let d = this.dragObject;
                if (!d.isDrag) return;

                const isTouch = e.type === 'touchmove';
                const coords = isTouch ? e.touches[0] : e;
                d.isMove = true;
                const deltaX = coords.clientX - d.startX;
                const deltaY = coords.clientY - d.startY;


                if (d.name === '.table') {
                    let newWidth = Math.max(50, d.initialSize + deltaX);
                    d.th[d.index] = newWidth + 'px';
                    d.win.css('grid-template-columns', d.th.join(' '));
                } else {
                    const isDragType = d.name === '.drag';
                    let newX = d.initialX + deltaX;
                    let newY = d.initialY + deltaY;

                    const currentX = Math.max(isDragType ? -500 : d.minWidth, Math.min(newX, d.maxWidth));
                    const currentY = Math.max(isDragType ? 33 : d.minHeight, Math.min(newY, d.maxHeight));

                    if (d.lastX === currentX && d.lastY === currentY) return;
                    d.lastX = currentX; d.lastY = currentY;
                    d.currentX = currentX; d.currentY = currentY;

                    const maskNode = this.$mask.nodes[0];
                    if (isDragType) {
                        Mikado.setStyle(maskNode, 'transform', `translate(${currentX}px, ${currentY}px)`)
                    } else {
                        Mikado.setStyle(maskNode, { "width": currentX + 'px', "height": currentY + 'px' });
                    }
                }
            }
            catch (err) {
                console.error(err.message)
            }
            finally {
               this.raf = null;
            }
        })
    },

    mouseupHandler(isTouch) {
        let d = this.dragObject;
        const maskNode = this.$mask.nodes[0];

        if (d.name === '.table') {
            d.win.css('cursor', 'auto');
        } else {
            if (d.isMove) {
                const cssUpdate = d.name === '.drag'
                    ? { transform: `translate(${d.currentX}px, ${d.currentY}px)` }
                    : { width: d.currentX + 'px', height: d.currentY + 'px' };
                d.win.css(cssUpdate);
            }
            Mikado.setStyle(maskNode, { visibility: "hidden", "will-Change": "auto" });
        }

        if (isTouch) {
            u(document).off('touchmove', this._moveHandler);
            u(document).off('touchend', this._upHandler);
        } else {
            u(document).off('mousemove', this._moveHandler);
            u(document).off('mouseup', this._upHandler);
        }

        this.clearDragObject();
    },

    clearDragObject() {
        this.dragObject = { ...this.initialDragState };
    },
};