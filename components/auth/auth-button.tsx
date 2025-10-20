"use client";

import { useCurrentUser } from "@/hooks/react-queries/auth";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import LoginForm from "../form/login-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOutIcon } from "lucide-react";
import { useLogoutMutation } from "@/hooks/react-queries/auth";
import { useState } from "react";

export default function AuthButton() {
  const { data: user, error } = useCurrentUser();
  const { mutate } = useLogoutMutation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    mutate();
    setShowLogoutDialog(false);
  };

  return (
    <>
      {(!user || error) && (
        <Dialog>
          <DialogTrigger>
            <Button>Employer Portal</Button>
          </DialogTrigger>

          <DialogContent className="w-[50vw]">
            <DialogTitle>Employer Login</DialogTitle>
            <LoginForm />
          </DialogContent>
        </Dialog>
      )}
      {user && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOutIcon className="text-danger" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showLogoutDialog}
            onOpenChange={setShowLogoutDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the home page and will need to log
                  in again to access the admin portal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
