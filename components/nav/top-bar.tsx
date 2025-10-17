import LoginForm from "../form/login-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function TopBar() {
  return (
    <div className="fixed top-0 h-[8vh] border-b max-w-7xl bg-background z-50 w-full flex justify-between px-6 items-center">
      <h1 className="text-lg font-semibold">Hiring Platform</h1>

      <Dialog>
        <DialogTrigger>
          <Button>Employer Portal</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Employer Login</DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
