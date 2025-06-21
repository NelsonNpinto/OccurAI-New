import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

const ARC_CONFIG = [
  { start: 0, end: 138, color: 'rgba(228, 199, 130, 0.3)' },
  { start: 154, end: 282, color: 'rgba(228, 199, 130, 0.3)' }, 
  { start: 298, end: 350, color: 'rgba(228, 199, 130, 0.3)' }, 
];

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (x, y, r, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
  ].join(' ');
};

const getConstrainedPointerPosition = (angle) => {
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  for (let i = 0; i < ARC_CONFIG.length; i++) {
    const arc = ARC_CONFIG[i];
    if (normalizedAngle >= arc.start && normalizedAngle <= arc.end) {
      return normalizedAngle; 
    }
  }

  if (normalizedAngle > 138 && normalizedAngle < 154) {
    return 154;
  } else if (normalizedAngle > 282 && normalizedAngle < 298) {
    return 298;
  } else if (normalizedAngle > 350 || normalizedAngle < 0) {
    return 0;
  }

  return normalizedAngle;
};

export default function BreathingArc({ 
  size = 200, 
  strokeWidth = 8, 
  pointerAngle = 0
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Constrain pointer to only appear on arcs
  const constrainedAngle = getConstrainedPointerPosition(pointerAngle);
  const pointer = polarToCartesian(cx, cy, radius, constrainedAngle);

  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Svg width={size} height={size}>
        <G>
          {ARC_CONFIG.map(({ start, end, color }, index) => (
            <Path
              key={index}
              d={describeArc(cx, cy, radius, start, end)}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <Circle
            cx={pointer.x}
            cy={pointer.y}
            r={6}
            fill="#E4C782"
            stroke="#E4C782"
            strokeWidth={2}
          />
        </G>
      </Svg>
    </View>
  );
}