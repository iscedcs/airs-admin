import { options } from "@/app/api/auth/options";
import { SearchCompanies } from "@/components/pages/company/company-search";
import RoleGateServer from "@/components/shared/RoleGate";
import { PaginationISCE } from "@/components/shared/pagination-isce";
// import { AddGroupModal } from "@/components/ui/add-modal-group";
import { Dialog } from "@/components/ui/dialog";
import { companiesColumn } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HAS_COMPANY_ACCESS } from "@/lib/consts";
import {
  getCompaniesByType,
  getCompanies,
  getCompaniesByUserID,
  getDeletedCompanies,
  basicUserGetAllCompanies,
} from "@/lib/controller/company-controller";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(options);
  if (!session?.user.role) return redirect("/sign-in");

  const role = session.user.role;
  const uID = session.user.id;
  const IsCompanyAgent = HAS_COMPANY_ACCESS.includes(
    role as (typeof HAS_COMPANY_ACCESS)[number]
  );

  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "15";
  const searchQuery = searchParams["query"] ?? "";

  // When searching, fetch ALL data instead of paginated data
  const shouldFetchAll = !!searchQuery;

  const massTransit = await getCompaniesByType("MASS_TRANSIT", page, limit);
  const privateType = await getCompaniesByType("PRIVATE", page, limit);

  const companies = await getCompanies(
    shouldFetchAll ? "1" : page,
    shouldFetchAll ? "999999" : limit,
    false
  );
  const basicCompanyFetch = await basicUserGetAllCompanies(
    shouldFetchAll ? "1" : page,
    shouldFetchAll ? "999999" : limit,
    false
  );

  const companyAgent = await getCompaniesByUserID(
    uID,
    shouldFetchAll ? "1" : page,
    shouldFetchAll ? "999999" : limit
  );

  const deletedCompanies = await getDeletedCompanies(
    shouldFetchAll ? "1" : page,
    shouldFetchAll ? "999999" : limit,
    false
  );

  // Filter companies based on search query if present
  const filterCompaniesByName = (companies: any[]) => {
    if (!searchQuery) return companies;
    return companies.filter((company) =>
      company.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const allActiveCompanies =
    role.toLowerCase() === "company_agent"
      ? companyAgent?.companies ?? []
      : role.toLowerCase() === "airs_admin"
      ? basicCompanyFetch?.rows ?? []
      : [];

  const allDeletedCompanies = deletedCompanies
    ? deletedCompanies.filteredCompanies
    : []; 
  // const allMassTransit = deletedCompanies
  //   ? deletedCompanies.filteredCompanies
  //   : [];
  // const allDeletedCompanies = deletedCompanies
  //   ? deletedCompanies.filteredCompanies
  //   : [];

  const filteredActiveCompanies = filterCompaniesByName(allActiveCompanies);
  const filteredDeletedCompanies = filterCompaniesByName(allDeletedCompanies);

  // Apply pagination to filtered results when searching
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  const paginatedActiveCompanies = searchQuery
    ? filteredActiveCompanies.slice(start, end)
    : filteredActiveCompanies;

  const paginatedDeletedCompanies = searchQuery
    ? filteredDeletedCompanies.slice(start, end)
    : filteredDeletedCompanies;

  // Calculate totals
  const activeCompaniesTotal = searchQuery
    ? filteredActiveCompanies.length
    : role.toLowerCase() === "company_agent"
    ? companyAgent?.totalCompanies
    : role.toLowerCase() === "superadmin"
    ? companies?.meta.totalCompanies ?? 0
    : 0;

  const deletedCompaniesTotal = searchQuery
    ? filteredDeletedCompanies.length
    : deletedCompanies?.meta.totalCompanies ?? 0;

  const totalCompanies = searchQuery
    ? filteredActiveCompanies.length + filteredDeletedCompanies.length
    : role.toLowerCase() === "airs_admin"
    ? basicCompanyFetch?.meta.totalCompanies
    : role.toLowerCase() === "superadmin"
    ? (companies?.meta.totalCompanies ?? 0) +
      (deletedCompanies?.meta.totalCompanies ?? 0)
    : 0;

  return (
    <RoleGateServer opts={{ allowedRole: HAS_COMPANY_ACCESS }}>
      <div className=" py-[20px] px-4">
        <div className="flex items-center flex-wrap gap-2 justify-between font-bold uppercase">
          <h1 className="shrink-0 grow-0">
            All Companies ({totalCompanies})
            {searchQuery && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                - Searching for "{searchQuery}"
              </span>
            )}
          </h1>

          {/* <div className="flex items-center gap-4">
            {IsCompanyAgent && (
              <div className="shrink-0 grow-0">
                <Dialog>
                  <AddGroupModal />
                </Dialog>
              </div>
            )}
          </div> */}
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All ({basicCompanyFetch?.meta.totalCompanies})
            </TabsTrigger>
            <TabsTrigger value="massTransit">
              Private ({massTransit?.meta.totalCompanies})
            </TabsTrigger>
            <TabsTrigger value="private">
              Mass Transit ({privateType?.meta.totalCompanies})
            </TabsTrigger>
          </TabsList>
          <div className=" w-full mt-[10px]">
            <SearchCompanies placeholder="Enter company name" />
          </div>
          <TabsContent value="all">
            {IsCompanyAgent && (
              <>
                <div className="mb-10 flex flex-col gap-5">
                  <DataTable
                    showColumns
                    columns={companiesColumn}
                    data={paginatedActiveCompanies}
                  />
                </div>
                <PaginationISCE
                  hasNextPage={
                    searchQuery
                      ? end < filteredActiveCompanies.length
                      : role.toLowerCase() === "company_agent"
                      ? end < (companyAgent?.totalCompanies ?? 0)
                      : role.toLowerCase() === "airs_admin"
                      ? end < (basicCompanyFetch?.meta.totalCompanies ?? 0)
                      : false
                  }
                  hasPrevPage={start > 0}
                  page={Number(page)}
                  limit={Number(limit)}
                  total={
                    searchQuery
                      ? filteredActiveCompanies.length
                      : role.toLowerCase() === "airs_admin"
                      ? Number(basicCompanyFetch?.meta.totalCompanies) ?? 0
                      : role.toLowerCase() === "company_agent"
                      ? Number(companyAgent?.totalCompanies) ?? 0
                      : 0
                  }
                  hrefPrefix="/companies"
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="massTransit">
            {IsCompanyAgent && (
              <>
                <div className="mb-10 flex flex-col gap-5">
                  <DataTable
                    showColumns
                    columns={companiesColumn}
                    data={massTransit?.filteredCompanies ?? []}
                  />
                </div>
                <PaginationISCE
                  hasNextPage={end < (massTransit?.meta?.totalPages ?? 0)}
                  hasPrevPage={start > 0}
                  page={Number(page)}
                  limit={Number(limit)}
                  total={Number(massTransit?.meta.totalCompanies)}
                  hrefPrefix="/companies"
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="private">
            {IsCompanyAgent && (
              <>
                <div className="mb-10 flex flex-col gap-5">
                  <DataTable
                    showColumns
                    columns={companiesColumn}
                    data={privateType?.filteredCompanies ?? []}
                  />
                </div>
                <PaginationISCE
                  hasNextPage={end < (privateType?.meta?.totalPages ?? 0)}
                  hasPrevPage={start > 0}
                  page={Number(page)}
                  limit={Number(limit)}
                  total={Number(privateType?.meta.totalCompanies)}
                  hrefPrefix="/companies"
                />
              </>
            )}
          </TabsContent>
          {role.toLowerCase() != "company_agent" && (
            <TabsContent value="deleted">
              {IsCompanyAgent && (
                <>
                  <div className="mb-10 flex flex-col gap-5">
                    <DataTable
                      columns={companiesColumn}
                      data={paginatedDeletedCompanies}
                    />
                  </div>
                  <PaginationISCE
                    hasNextPage={
                      searchQuery
                        ? end < filteredDeletedCompanies.length
                        : deletedCompanies
                        ? end < deletedCompanies.meta?.totalCompanies
                        : false
                    }
                    hasPrevPage={start > 0}
                    page={Number(page)}
                    limit={Number(limit)}
                    total={
                      searchQuery
                        ? filteredDeletedCompanies.length
                        : Number(deletedCompanies?.meta?.totalCompanies ?? 0)
                    }
                    hrefPrefix="/companies"
                  />
                </>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </RoleGateServer>
  );
}
