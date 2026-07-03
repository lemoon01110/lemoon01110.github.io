document.addEventListener('DOMContentLoaded', () => {
    const digital = document.getElementById('clock-digital');
    const hourHand = document.getElementById('clock-hour');
    const minuteHand = document.getElementById('clock-minute');
    const secondHand = document.getElementById('clock-second');

    function getPillIntersection(angleDeg, pillWidth, pillHeight, margin) {
        const R = (pillHeight / 2) - margin;
        const rectHalfWidth = (pillWidth / 2) - (pillHeight / 2);
        
        // 0 deg is UP, clockwise
        const theta = angleDeg * Math.PI / 180;
        const dx = Math.sin(theta);
        const dy = -Math.cos(theta);

        // Try top/bottom edge intersection
        if (Math.abs(dy) > 0.0001) {
            const yEdge = dy > 0 ? R : -R;
            const t_rect = yEdge / dy;
            const x_rect = t_rect * dx;
            if (Math.abs(x_rect) <= rectHalfWidth) {
                return { x: x_rect, y: yEdge };
            }
        }
        
        // Otherwise, intersection with left or right semicircle
        const cx = dx > 0 ? rectHalfWidth : -rectHalfWidth;
        const a = 1;
        const b = -2 * dx * cx;
        const c = cx * cx - R * R;
        const D = b * b - 4 * a * c;
        const t = (-b + Math.sqrt(D)) / 2;
        
        return { x: t * dx, y: t * dy };
    }

    function applyTransform(hand, angleDeg) {
        if (!hand) return;
        // Pill dimensions: 220x80. We use a 0px margin so dots are exactly on the edge and half-clipped.
        const {x, y} = getPillIntersection(angleDeg, 220, 80, 0);
        
        // Compute angle pointing towards center (0,0)
        // atan2(-y, -x) gives mathematical angle. We convert to CSS rotation where 0 is UP.
        const rot = Math.atan2(-y, -x) * 180 / Math.PI + 90;
        
        hand.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    }

    function updateClock() {
        if (!digital) return;

        // Force PST/PDT (America/Los_Angeles) timezone
        const nowStr = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
        const pstDate = new Date(nowStr);
        
        // Digital Time
        const h = String(pstDate.getHours()).padStart(2, '0');
        const m = String(pstDate.getMinutes()).padStart(2, '0');
        const s = String(pstDate.getSeconds()).padStart(2, '0');
        digital.textContent = `${h}:${m}:${s}`;

        // Analog Hands Angles
        const hours = pstDate.getHours() % 12;
        const minutes = pstDate.getMinutes();
        const seconds = pstDate.getSeconds();

        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = (minutes * 6) + (seconds * 0.1);
        const secondAngle = seconds * 6;

        applyTransform(hourHand, hourAngle);
        applyTransform(minuteHand, minuteAngle);
        applyTransform(secondHand, secondAngle);
    }

    // Initial update
    updateClock();

    // Update every second
    setInterval(updateClock, 1000);
});
