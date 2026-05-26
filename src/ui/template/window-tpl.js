export const window_tpl = `
<div key="data.id" class="{{data.className}}" data-id="{{data.id}}">
    <div data-movement="drag" class="title-bar" data-cm="window">
        <div data-movement="drag" data-cm="window" class="title-bar-text">
        <img src="{{data.iconUrl}}">
        {{data.title}}
        </div>
        <div class="title-bar-controls" style="{{ data.control.length ? '' : 'display: none;' }}">
            <div foreach="data.control">
                <button aria-label="{{ data.label }}" data-action="{{ data.action }}" data-args="{{ data.args }}"></button>
            </div>
        </div>
    </div>
    <div class="window-body"></div>
    <div data-movement="resize" class="{{data.isResize}}"></div>
    <div data-movement="drag" data-context="window" class="window-overlay"></div>
</div>
    `