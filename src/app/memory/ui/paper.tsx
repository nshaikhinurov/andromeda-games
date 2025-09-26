import { cn } from "@/lib/utils";

export const Paper = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8 dark:from-gray-800 dark:to-gray-900",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
