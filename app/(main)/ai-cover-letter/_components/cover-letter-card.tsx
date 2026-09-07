"use client";

import { deleteCoverLetter } from "@/actions/cover-letter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CoverLetter } from "@prisma/client";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const CoverLetterCard = ({ letter }: { letter: CoverLetter }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteCoverLetter(id);
      toast.success("Deleted cover letter successfully");
      router.refresh();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Error while deleting the cover letter");
        console.error("Error while deleting the cover letter" + error.message);
      } else {
        toast.error("Error while deleting the cover letter");
        console.error("Error while deleting the cover letter" + error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card key={letter.id} className="group relative bg-card saved-letter-card">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl gradient-title">
              {letter.jobTitle}{" "}
              <span className="font-normal text-muted-foreground mx-0.5">
                at
              </span>{" "}
              {letter.companyName}
            </CardTitle>
            <CardDescription>
              Created {format(new Date(letter.createdAt), "PPP")}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="cursor-pointer flex items-center border bg-neutral-950 border-zinc-700 hover:bg-neutral-900 hover:border-zinc-500 transition-colors duration-75 ease-in-out"
                >
                  <Link
                    href={`/ai-cover-letter/${letter.id}`}
                    aria-label={`View letter for ${letter.jobTitle}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Delete letter for ${letter.jobTitle}`}
                  disabled={isDeleting}
                  onClick={() => setOpen(true)}
                  className="cursor-pointer border-zinc-700 hover:border-red-800 hover:bg-red-700/20 transition-all duration-150 ease-in-out"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialog
              open={open}
              onOpenChange={(value) => {
                if (!isDeleting) setOpen(value);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Permanently delete your cover
                    letter for {letter.jobTitle} at {letter.companyName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={isDeleting}
                    onClick={() => setOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDelete(letter.id);
                    }}
                    className="cursor-pointer text-white bg-red-800 hover:bg-red-950 transition-all duration-150 ease-in-out"
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm line-clamp-3">
          {letter.jobDescription}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverLetterCard;
