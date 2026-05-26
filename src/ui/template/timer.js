export const timer_tpl = `
<div>
    <span>{{= data.date }}</span><br>
    <span>{{= data.hour }}</span>
    <span class="blink"> : </span>
    <span>{{= data.minute }}</span>
    <span class="blink"> : </span>
    <span>{{= data.second }}</span>
</div>
`