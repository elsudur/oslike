export const message_tpl = `
<div>
    <img src="{{data.icon}}" style="height:23px"/>
    <ul role="menu" class="{{ data.messages.length ? '' : 'd-none' }}" foreach="data.messages">
        <li role="menuitem">
            <img class="{{ data.icon ? '' : 'd-none' }}" src="{{ data.icon }}" />
            <label>{{ data.label }}</label>
        </li>
    </ul>
</div>
`