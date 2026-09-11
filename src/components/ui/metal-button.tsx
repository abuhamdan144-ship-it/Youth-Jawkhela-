import * as React from 'react';
import { MetalFx, type MetalFxPreset } from 'metal-fx';

type SurfaceTheme = 'auto' | 'light' | 'dark';

function useSurfaceTheme(theme: SurfaceTheme): 'light' | 'dark' {
  const [resolved, setResolved] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    if (theme !== 'auto') {
      setResolved(theme);
      return;
    }

    const root = document.documentElement;
    const update = () => {
      setResolved(root.classList.contains('dark') ? 'dark' : 'light');
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  return resolved;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface MetalButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  preset?: MetalFxPreset;
  theme?: SurfaceTheme;
  strength?: number;
  size?: 'sm' | 'md' | 'lg';
  paused?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const SIZE = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-7 text-base',
} as const;

export function MetalButton({
  preset = 'chromatic',
  theme = 'auto',
  strength = 1,
  size = 'md',
  paused = false,
  className,
  wrapperClassName,
  children,
  type = 'button',
  ...props
}: MetalButtonProps) {
  const resolvedTheme = useSurfaceTheme(theme);

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme={resolvedTheme}
      strength={strength}
      paused={paused}
      className={cn('inline-flex', wrapperClassName)}
    >
      <button
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-out',
          'text-neutral-900 hover:opacity-80 active:scale-[0.97] dark:text-white',
          'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60',
          SIZE[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </MetalFx>
  );
}

export default MetalButton;
