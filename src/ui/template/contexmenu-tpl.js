export const contexmenu_tpl = `
<li role="menuitem" tabindex="0" aria-haspopup="{{data.popup}}" aria-disabled="{{data.disabled}}" class="{{data.class}}">
    <img src="{{data.iconUrl}}" class="{{data.iconClass}}">
    <label class="onclick" data-context="{{ data.context }}" data-action="{{ data.action }}" data-args="{{ data.args }}">{{data.label}}</label>
    <ul role="menu" class="{{data.ulClass}}" foreach="data.child" >
        <li role="menuitem" tabindex="0" aria-haspopup="{{data.popup}}" aria-disabled="{{data.disabled}}" class="{{data.class}}">
            <img src="{{data.iconUrl}}" class="{{data.iconClass}}">
            <label class="onclick" data-context="{{ data.context }}" data-action="{{ data.action }}" data-args="{{ data.args }}">{{data.label}}</label>
        </li>
    </ul>
</li>
`