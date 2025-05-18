type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-64 text-2xl uppercase text-zinc-950 rounded-md bg-zinc-100 p-2 shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:shadow-lg hover:tracking-wide"
      {...rest}
    >
      {children}
    </button>
  );
};
