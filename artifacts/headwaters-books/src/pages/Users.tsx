import { useState } from "react";
import { 
  useListBookkeeperUsers, 
  useUpdateBookkeeperUser,
  getListBookkeeperUsersQueryKey
} from "@workspace/api-client-react";
import { BookkeeperRole, BookkeeperUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
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
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function Users() {
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useListBookkeeperUsers();
  const updateUser = useUpdateBookkeeperUser();
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: BookkeeperUser | null;
    newRole: BookkeeperRole | null;
  }>({ isOpen: false, user: null, newRole: null });

  const handleRoleChange = (user: BookkeeperUser, newRole: BookkeeperRole) => {
    if (user.role === newRole) return;
    setConfirmDialog({ isOpen: true, user, newRole });
  };

  const confirmRoleChange = () => {
    if (!confirmDialog.user || !confirmDialog.newRole) return;
    
    const userId = confirmDialog.user.id;
    const newRole = confirmDialog.newRole;
    
    updateUser.mutate({
      id: userId,
      data: { role: newRole }
    }, {
      onSuccess: () => {
        toast.success("User role updated successfully");
        setConfirmDialog({ isOpen: false, user: null, newRole: null });
        queryClient.invalidateQueries({ queryKey: getListBookkeeperUsersQueryKey() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to update role");
        setConfirmDialog({ isOpen: false, user: null, newRole: null });
      }
    });
  };

  const formatRole = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage access roles across the agency.</p>
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                </TableCell>
              </TableRow>
            ) : !users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.firstName ? `${u.firstName} ${u.lastName || ''}` : '-'}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {u.lastSeenAt ? format(new Date(u.lastSeenAt), 'MMM d, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Select 
                      value={u.role} 
                      onValueChange={(val) => handleRoleChange(u, val as BookkeeperRole)}
                    >
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BookkeeperRole).map(role => (
                          <SelectItem key={role} value={role}>
                            {formatRole(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, user: null, newRole: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Change User Role
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change <strong>{confirmDialog.user?.email}</strong>'s role from {confirmDialog.user && formatRole(confirmDialog.user.role)} to <strong>{confirmDialog.newRole && formatRole(confirmDialog.newRole)}</strong>?
              This will immediately alter their access permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange} disabled={updateUser.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {updateUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
