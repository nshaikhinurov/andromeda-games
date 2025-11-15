import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KeyboardButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-7 w-7 p-0 text-xl sm:h-10 sm:w-10 md:h-12 md:w-12",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const VirtualKeyboard = ({
  onKeyPress,
}: {
  onKeyPress: (key: string) => void;
}) => {
  return (
    <div className="mt-10 flex flex-col items-center gap-1 rounded-md border p-2 sm:p-4">
      <div className="flex gap-1">
        <KeyboardButton onClick={() => onKeyPress("1")}>1</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("2")}>2</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("3")}>3</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("4")}>4</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("5")}>5</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("6")}>6</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("7")}>7</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("8")}>8</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("9")}>9</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("0")}>0</KeyboardButton>
      </div>
      <div className="flex gap-1">
        <KeyboardButton onClick={() => onKeyPress("Q")}>Q</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("W")}>W</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("E")}>E</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("R")}>R</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("T")}>T</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("Y")}>Y</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("U")}>U</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("I")}>I</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("O")}>O</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("P")}>P</KeyboardButton>
      </div>
      <div className="flex gap-1">
        <KeyboardButton onClick={() => onKeyPress("A")}>A</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("S")}>S</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("D")}>D</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("F")}>F</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("G")}>G</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("H")}>H</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("J")}>J</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("K")}>K</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("L")}>L</KeyboardButton>
      </div>
      <div className="flex gap-1">
        <KeyboardButton onClick={() => onKeyPress("Z")}>Z</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("X")}>X</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("C")}>C</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("V")}>V</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("B")}>B</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("N")}>N</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("M")}>M</KeyboardButton>
        <KeyboardButton onClick={() => onKeyPress("Backspace")}>
          {"<"}
        </KeyboardButton>
      </div>
    </div>
  );
};
