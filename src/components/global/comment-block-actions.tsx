"use client";

import { FaEllipsis } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";
import { deleteReviewComment } from "@/lib/db-actions";

interface CommentBlockActionsProps {
  commentId: string;
}

export default function CommentBlockActions({
  commentId,
}: CommentBlockActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function handleDelete() {
    const result = await deleteReviewComment(commentId);
    if (!result) toast.error("Failed to delete comment.");
    toast.success("Your comment has been successfully deleted.");
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsis className="-mt-4 justify-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black" align="end">
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <FaTrash className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your comment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
