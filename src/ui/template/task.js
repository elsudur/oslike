export const task_tpl = `
<div class="{{data.class }}">
    <img src="{{ data.iconUrl }}">
    <ul role="menu" class="{{ data.child?.length ? '' : 'd-none' }}" foreach="data.child">
        <li role="menuitem" >
            <img class="{{ data.iconUrl ? '' : 'd-none' }}" src="{{ data.iconUrl }}" />
            <label class="onclick" data-context="window" data-action="show" data-args="{{ data.id }}">{{ data.title }}</label>
        </li>
    </ul>
</div>
`