import React, { useEffect, useState } from 'react';

interface PrecentBarProps {
    percentage: number;
}

// HEX 색상 → RGB 변환
const hexToRgb = (hex: string) => {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
};

// RGB → HEX 변환
const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
};

// 두 색상 사이를 percentage에 따라 보간
const interpolateColor = (start: string, end: string, percentage: number) => {
    const startRGB = hexToRgb(start);
    const endRGB = hexToRgb(end);

    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * (percentage / 100));
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * (percentage / 100));
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * (percentage / 100));

    return rgbToHex(r, g, b);
};

const PodPercentBar: React.FC<PrecentBarProps> = ({ percentage }) => {
    const startColor = '#52D4E0';
    const endColor = '#33BBFF';
    const [percent, setPercent] = useState<number>(Math.min(percentage, 100));
    const currentColor = interpolateColor(startColor, endColor, percent);

    useEffect(() => {
        setPercent(Math.min(percentage, 100));
    }, [percentage]);

    return (
        <div
            style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e0e0de',
                borderRadius: '10px',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: currentColor,
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
            />
        </div>
    );
};

export default PodPercentBar;
