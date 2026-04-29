import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/useUsers";
import { getInitials, getRoleBadgeVariant } from "@/utils";
import EditEmployeeDialog from "./EditEmployeeDialog";

const EmployeesTable = () => {
  const { data: employees, isLoading } = useUsers();

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-75">Employee</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                Loading employees...
              </TableCell>
            </TableRow>
          ) : employees?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground h-32 text-center"
              >
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees?.map((employee) => (
              <TableRow
                key={employee._id}
                className={!employee.active ? "opacity-60" : ""}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {getInitials(employee.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-foreground truncate text-sm font-medium">
                        {employee.username}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {employee.roles?.[0] || "Staff"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  @{employee.username}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeVariant(role)}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  {employee.active ? (
                    <Badge
                      variant="outline"
                      className="border-green-500/50 bg-green-500/10 text-green-500"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* EDIT EMPLOYEE DIALOG */}
                  <EditEmployeeDialog employee={employee} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;
