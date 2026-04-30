import AddEmployeeDialog from "./AddEmployeeDialog";
import EmployeesStatsCards from "./EmployeesStatsCards";
import EmployeesTable from "./EmployeesTable";

const EmployeesList = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Page Title & Stats */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their account permissions.
            </p>
          </div>
          {/* ADD EMPLOYEE DIALOG */}
          <AddEmployeeDialog />
        </div>
        {/* Stats Cards */}
        <EmployeesStatsCards />
      </div>
      {/* Filters */}
      <div className="bg-card border-border rounded-lg border">
        {/* Table */}
        <EmployeesTable />
        {/* Pagination */}
      </div>
    </section>
  );
};

export default EmployeesList;
