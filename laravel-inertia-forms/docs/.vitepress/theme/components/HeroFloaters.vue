<template>
    <!-- Decorative form pieces floating around the hero text. -->
    <div class="hero-floaters" aria-hidden="true">
        <div class="floater floater-toggle">
            <span class="floater-label">Send invite</span>
            <span class="floater-switch"><span /></span>
        </div>

        <div class="floater floater-date">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            <span>Oct 5 – Oct 9</span>
        </div>

        <div class="floater floater-valid">
            <span class="floater-check"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg></span>
            <span>Validated by Laravel</span>
        </div>

        <div class="floater floater-tags">
            <span class="floater-tag">Aisha ×</span>
            <span class="floater-tag">Ben ×</span>
            <span class="floater-tag floater-tag-new">+ Add</span>
        </div>

        <div class="floater floater-slider">
            <span class="floater-label">Capacity</span>
            <span class="floater-track"><span class="floater-fill" /><span class="floater-knob" /></span>
        </div>

        <div class="floater floater-otp">
            <span>4</span><span>2</span><span>7</span><span class="floater-otp-caret" />
        </div>
    </div>
</template>

<style scoped>
.hero-floaters {
    position: absolute;
    inset: -40px -120px;
    pointer-events: none;
    z-index: 0;
}

.floater {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid #e4e4e7;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
    color: #27272a;
    font-size: 0.82rem;
    font-weight: 600;
    white-space: nowrap;
    animation: float 7s ease-in-out infinite;
    backdrop-filter: blur(6px);
}

.floater svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.floater-label {
    color: #52525b;
}

/* Left side */
.floater-toggle {
    top: 12%;
    left: 0;
    transform: rotate(-4deg);
}

.floater-switch {
    position: relative;
    width: 34px;
    height: 20px;
    border-radius: 999px;
    background: #d4d4d8;
    animation: switch-track 4s ease-in-out infinite;
}

.floater-switch span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    animation: switch-knob 4s ease-in-out infinite;
}

.floater-date {
    top: 44%;
    left: 4%;
    color: #1d4ed8;
    animation-delay: -2s;
    animation-duration: 8s;
}

.floater-valid {
    top: 74%;
    left: 1%;
    color: #15803d;
    animation-delay: -4s;
}

.floater-check {
    display: grid;
    width: 20px;
    height: 20px;
    place-items: center;
    border-radius: 50%;
    background: #dcfce7;
    animation: pop 3.5s ease-in-out infinite;
}

.floater-check svg {
    width: 12px;
    height: 12px;
    stroke-width: 3;
}

/* Right side */
.floater-tags {
    top: 10%;
    right: 1%;
    gap: 6px;
    padding: 8px;
    transform: rotate(3deg);
    animation-delay: -1s;
    animation-duration: 7.5s;
}

.floater-tag {
    padding: 3px 9px;
    border-radius: 7px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.76rem;
}

.floater-tag-new {
    background: transparent;
    color: #a1a1aa;
    animation: fade-in-out 4s ease-in-out infinite;
}

.floater-slider {
    top: 42%;
    right: 3%;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    width: 170px;
    animation-delay: -3s;
    animation-duration: 8.5s;
}

.floater-track {
    position: relative;
    height: 5px;
    border-radius: 999px;
    background: #e4e4e7;
}

.floater-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: inherit;
    background: #2563eb;
    animation: slider-fill 5s ease-in-out infinite;
}

.floater-knob {
    position: absolute;
    top: 50%;
    width: 15px;
    height: 15px;
    margin: -7.5px 0 0 -7.5px;
    border: 2.5px solid #2563eb;
    border-radius: 50%;
    background: #ffffff;
    animation: slider-knob 5s ease-in-out infinite;
}

.floater-otp {
    top: 72%;
    right: 2%;
    gap: 6px;
    padding: 8px;
    transform: rotate(-3deg);
    animation-delay: -5s;
}

.floater-otp span {
    display: grid;
    width: 28px;
    height: 34px;
    place-items: center;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    color: #09090b;
    font-family: var(--vp-font-family-mono);
    font-size: 0.95rem;
}

.floater-otp .floater-otp-caret {
    position: relative;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.floater-otp .floater-otp-caret::after {
    content: '';
    width: 2px;
    height: 16px;
    background: #2563eb;
    animation: blink 1s steps(2, start) infinite;
}

@keyframes float {
    0%,
    100% {
        translate: 0 0;
    }
    50% {
        translate: 0 -12px;
    }
}

@keyframes switch-track {
    0%,
    40% {
        background: #d4d4d8;
    }
    50%,
    90% {
        background: #2563eb;
    }
    100% {
        background: #d4d4d8;
    }
}

@keyframes switch-knob {
    0%,
    40% {
        translate: 0 0;
    }
    50%,
    90% {
        translate: 14px 0;
    }
    100% {
        translate: 0 0;
    }
}

@keyframes slider-fill {
    0%,
    100% {
        width: 30%;
    }
    50% {
        width: 78%;
    }
}

@keyframes slider-knob {
    0%,
    100% {
        left: 30%;
    }
    50% {
        left: 78%;
    }
}

@keyframes pop {
    0%,
    70%,
    100% {
        scale: 1;
    }
    80% {
        scale: 1.25;
    }
}

@keyframes fade-in-out {
    0%,
    100% {
        opacity: 0.35;
    }
    50% {
        opacity: 1;
    }
}

@keyframes blink {
    to {
        visibility: hidden;
    }
}

/* Only on wide screens, where there is room beside the text. */
@media (max-width: 1279px) {
    .hero-floaters {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero-floaters *,
    .floater {
        animation: none !important;
    }
}

:global(.dark .hero-floaters .floater) {
    border-color: #27272a;
    background: rgba(24, 24, 27, 0.9);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
    color: #e4e4e7;
}

:global(.dark .hero-floaters .floater-label) {
    color: #a1a1aa;
}

:global(.dark .hero-floaters .floater-date) {
    color: #93c5fd;
}

:global(.dark .hero-floaters .floater-valid) {
    color: #86efac;
}

:global(.dark .hero-floaters .floater-check) {
    background: rgba(34, 197, 94, 0.18);
}

:global(.dark .hero-floaters .floater-tag) {
    background: rgba(37, 99, 235, 0.18);
    color: #93c5fd;
}

:global(.dark .hero-floaters .floater-tag-new) {
    background: transparent;
    color: #71717a;
}

:global(.dark .hero-floaters .floater-track) {
    background: #3f3f46;
}

:global(.dark .hero-floaters .floater-knob) {
    background: #18181b;
}

:global(.dark .hero-floaters .floater-otp span) {
    border-color: #3f3f46;
    color: #fafafa;
}
</style>
