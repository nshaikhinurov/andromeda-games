import { FaGear, FaListCheck, FaRegClock } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/fsd/shared/ui/dropdown-menu";
import { Label } from "~/fsd/shared/ui/label";
import { Switch } from "~/fsd/shared/ui/switch";
import cn from "clsx";

type SettingsMenuProps = {
  triggerClassName?: string;
};

export const SettingsMenu = ({ triggerClassName }: SettingsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          triggerClassName,
          "text-neutral-700 transition-all duration-250 ease-in-out hover:text-black",
        )}
      >
        <FaGear />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <FaRegClock />
            <span className="grow">Show clock</span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-clock-mode">On</Label>
              <Switch id="show-clock-mode" />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <FaListCheck />
            <span className="grow">Auto-check</span>
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-check-mode">On</Label>
              <Switch id="auto-check-mode" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
