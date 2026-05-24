import React from 'react';

// Mirrors the geometry constants from NewsCard.tsx exactly
const W = 290;
const H = 320;
const CR = 28;
const G = 8;
const SR = 18;
const IR = SR + G;
const BW = 43;
const BH = 43;
const TbW = 110;
const TbH = 38;
const GAP = 10;

const TY = BH + G;
const BY = H - TbH - G;

function buildCardPath(): string {
    const tx = BW + G, ty = BH + G;
    const bx = W - TbW - G, by = H - TbH - G;
    return [
        `M ${tx + SR} 0`,
        `L ${W - CR} 0`, `A ${CR} ${CR} 0 0 1 ${W} ${CR}`,
        `L ${W} ${by - SR}`, `A ${SR} ${SR} 0 0 1 ${W - SR} ${by}`,
        `L ${bx + IR} ${by}`, `A ${IR} ${IR} 0 0 0 ${bx} ${by + IR}`,
        `L ${bx} ${H - SR}`, `A ${SR} ${SR} 0 0 1 ${bx - SR} ${H}`,
        `L ${CR} ${H}`, `A ${CR} ${CR} 0 0 1 0 ${H - CR}`,
        `L 0 ${ty + SR}`, `A ${SR} ${SR} 0 0 1 ${SR} ${ty}`,
        `L ${tx - IR} ${ty}`, `A ${IR} ${IR} 0 0 0 ${tx} ${ty - IR}`,
        `L ${tx} ${SR}`, `A ${SR} ${SR} 0 0 1 ${tx + SR} 0`,
        'Z',
    ].join(' ');
}

const path = buildCardPath();

// Image area coordinates
const IMG_TOP = TY + GAP;                // 61
const IMG_BOTTOM_Y = H - ((H - BY) + GAP); // 264
const IMG_H = IMG_BOTTOM_Y - IMG_TOP;    // 203
const IMG_X = GAP;                       // 10
const IMG_W = W - GAP * 2;              // 270

export default function NewsCardSkeleton() {
    const id = React.useId().replace(/:/g, '');
    const clipId = `sk-clip-${id}`;
    const shimId = `sk-shim-${id}`;

    return (
        <div
            dir="ltr"
            style={{ position: 'relative', width: W, height: H, flexShrink: 0 }}
            aria-hidden="true"
        >
            {/* Card shape with shimmer fill */}
            <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                style={{ display: 'block' }}
            >
                <defs>
                    <clipPath id={clipId}>
                        <path d={path} />
                    </clipPath>
                    {/* Animated shimmer gradient */}
                    <linearGradient id={shimId} x1="0" y1="0" y2="0"
                        gradientUnits="userSpaceOnUse"
                        x2={W * 2} gradientTransform={`translate(${-W} 0)`}
                    >
                        <stop offset="0%"   stopColor="#f3f4f3" />
                        <stop offset="50%"  stopColor="#eaf2ed" />
                        <stop offset="100%" stopColor="#f3f4f3" />
                        <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            from={`${-W} 0`}
                            to={`${W} 0`}
                            dur="1.6s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>
                </defs>

                {/* Base card shape */}
                <path d={path} fill={`url(#${shimId})`} clipPath={`url(#${clipId})`} />

                {/* Badge circle (top-left) — green tinted placeholder */}
                <circle
                    cx={BW / 2}
                    cy={BH / 2}
                    r={BW / 2}
                    fill="rgba(58,170,106,0.18)"
                    clipPath={`url(#${clipId})`}
                />

                {/* Title line 1 */}
                <rect
                    x={BW + G + 10}
                    y={12}
                    width={W - BW - G - 22}
                    height={9}
                    rx={4}
                    fill="rgba(0,0,0,0.07)"
                    clipPath={`url(#${clipId})`}
                />
                {/* Title line 2 (shorter) */}
                <rect
                    x={BW + G + 10}
                    y={27}
                    width={(W - BW - G - 22) * 0.65}
                    height={8}
                    rx={4}
                    fill="rgba(0,0,0,0.05)"
                    clipPath={`url(#${clipId})`}
                />

                {/* Image area */}
                <rect
                    x={IMG_X}
                    y={IMG_TOP}
                    width={IMG_W}
                    height={IMG_H}
                    rx={10}
                    fill="rgba(0,0,0,0.05)"
                    clipPath={`url(#${clipId})`}
                />

                {/* Meta row: rating/views placeholder */}
                <rect
                    x={GAP + 10}
                    y={IMG_BOTTOM_Y + 12}
                    width={60}
                    height={8}
                    rx={4}
                    fill="rgba(0,0,0,0.05)"
                    clipPath={`url(#${clipId})`}
                />

                {/* Read pill (bottom-right) — green tinted */}
                <rect
                    x={W - TbW - G}
                    y={H - TbH}
                    width={TbW}
                    height={TbH}
                    rx={TbH / 2}
                    fill="rgba(58,170,106,0.22)"
                    clipPath={`url(#${clipId})`}
                />
            </svg>
        </div>
    );
}
