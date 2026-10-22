import React from 'react';

export interface CounterProps {
  value?: number | string;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  decimals?: number;
  minDigits?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  direction?: 'auto' | 'up' | 'down' | 'shortest';
  duration?: number;
  bounce?: number;
  stagger?: number;
  motionBlur?: boolean;
  intro?: boolean;
  fade?: number;
  fontSize?: number | string;
  fontWeight?: React.CSSProperties['fontWeight'];
  textColor?: string;
  gap?: number;
  padding?: number;
  tabular?: boolean;
  digitStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

declare const Counter: React.FC<CounterProps>;

export default Counter;
