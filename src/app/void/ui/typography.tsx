import { cn } from "@/lib/utils";

// Common style classes
export const HEADING_STYLES = "text-3xl font-bold sm:text-4xl";
export const PARAGRAPH_STYLES = "leading-tight font-bold text-pretty";
export const SMALL_PARAGRAPH_STYLES = "leading-tight font-bold";

// Helper components for common patterns
export const H1 = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <h1 className={cn(HEADING_STYLES, className)} style={style}>
    {children}
  </h1>
);

export const P = ({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => (
  <p className={cn(PARAGRAPH_STYLES, className)} style={style}>
    {children}
  </p>
);
