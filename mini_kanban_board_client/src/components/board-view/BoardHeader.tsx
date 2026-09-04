"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BoardDetail, BoardMember } from "@/types/board";
import { User } from "@/types/auth";
import { inviteMemberAction, removeMemberAction } from "@/lib/actions/members";
import { toast } from "sonner";

interface BoardHeaderProps {
  board: BoardDetail;
  currentUser: User;
  members: BoardMember[];
}

export function BoardHeader({ board, currentUser, members }: BoardHeaderProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isOwner = currentUser.id === board.ownerId;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    const res = await inviteMemberAction(board.id, email.trim());
    setIsInviting(false);

    if (res.success) {
      toast.success("Member invited successfully");
      setEmail("");
    } else {
      toast.error(res.error);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from the board?")) return;
    
    setRemovingId(userId);
    const res = await removeMemberAction(board.id, userId);
    setRemovingId(null);

    if (res.success) {
      toast.success("Member removed");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-slate-900">{board.name}</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2 overflow-hidden">
            {/* Show up to 3 avatars */}
            {members.slice(0, 3).map((member) => (
              <div 
                key={member.id} 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700"
                title={member.user?.name || member.user?.email}
              >
                {member.user?.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {members.length > 3 && (
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                +{members.length - 3}
              </div>
            )}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Share board">
        <div className="space-y-6">
          {isOwner && (
            <form onSubmit={handleInvite} className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-700">Invite member</label>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isInviting}
                />
              </div>
              <Button type="submit" isLoading={isInviting} disabled={!email.trim()}>
                Invite
              </Button>
            </form>
          )}

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-900">Board Members</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {members.length === 0 && (
                <p className="text-sm text-slate-500">Only you have access to this board.</p>
              )}
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {member.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.user?.name}</p>
                      <p className="text-xs text-slate-500">{member.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-100 rounded-md">
                      {member.role}
                    </span>
                    {isOwner && member.userId !== currentUser.id && (
                      <button
                        onClick={() => handleRemove(member.userId)}
                        disabled={removingId === member.userId}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
