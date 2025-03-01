import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClick: () => void;
};

export default function Logout({ open, setOpen, handleClick }: Props) {
  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-5 right-5"
        size={"icon"}
      >
        <LogOut />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah anda yakin?</DialogTitle>
            <DialogDescription>
              Jika anda keluar anda akan diminta kembali kode untuk masuk
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <Button
              onClick={() => {
                signOut();
              }}
              type="button"
              variant="destructive"
              className="max-sm:mt-2"
            >
              Keluar
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
