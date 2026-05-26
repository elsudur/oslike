


export function createDigitalClock(locale = 'id-ID', timeZone = 'Asia/Jakarta') {
    const timeFormatter = new Intl.DateTimeFormat(locale, {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        timeZone,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    function getTime() {
        const now = new Date();
        const parts = timeFormatter.formatToParts(now);
        const map = {};
        for (const part of parts) {
            if (part.type !== 'literal') {
                map[part.type] = part.value;
            }
        }
        return {
            date: now,
            tanggal: dateFormatter.format(now), // 17 Mei 2026
            jam: map.hour,
            menit: map.minute,
            detik: map.second,
            waktu: `${map.hour}:${map.minute}:${map.second}`
        };
    }
    return {
        start(callback, interval = 1000) {
            callback(getTime());
            const id = setInterval(() => {
                callback(getTime());
            }, interval);
            return id;
        },
        stop(id) {
            clearInterval(id);
        },
        now: getTime
    };
}

