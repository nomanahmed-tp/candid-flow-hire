
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <BellIcon className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            2
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Notifications</p>
            <p className="text-xs leading-none text-muted-foreground">
              Recent updates and activities
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-col items-start py-2">
            <div className="flex w-full">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">New candidate applied</p>
                <p className="text-xs text-muted-foreground">
                  Sarah Johnson applied for Frontend Developer
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  5 minutes ago
                </p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start py-2">
            <div className="flex w-full">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Interview scheduled</p>
                <p className="text-xs text-muted-foreground">
                  Final interview for Michael Chen at 2:00 PM tomorrow
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  30 minutes ago
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
