const map = new Map()

function on(type, fn){
    if(!map.has(type)){
        map.set(type, [])
    }
    map.get(type).push(fn)
}

function emit(type, payload){
    const listeners = map.get(type);
    if(!listeners) return;

    const start = performance.now();
    for(const fn of listeners){
        try{
            fn(payload)
        }
        catch(err){
            console.error(
                "%cEVENT ERROR", 'color:lime;font-weight: bold',
                type, err
            )
        }
    }
    const end = performance.now()
    console.log(
        "%cPERFORMA", "color: orange",
        type, (end - start).toFixed(2) + "ms"
    )
}

export const eventbus = {on, emit}