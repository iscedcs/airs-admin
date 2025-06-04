import { options } from "@/app/api/auth/options";
import FormError from "@/components/shared/FormError";
import { users_role_enum } from "@prisma/client";
import { getServerSession } from "next-auth";
import React from "react";

export const revalidate = 0;

export default async function RoleGateServer({
     children,
     opts,
}: {
     children: React.ReactNode;
     opts: {
          allowedRole?: users_role_enum[];
          rejectedRole?: users_role_enum[];
     };
}) {
     const { allowedRole, rejectedRole } = opts;

     const session = await getServerSession(options);
     if (!session || !session.user) {
          return <FormError message="Access Denied" />;
     }
     const role = session?.user.role as users_role_enum;
     if (!role) return <FormError message="Access Denied" />;

     if (allowedRole && !allowedRole.includes(role)) {
          return <FormError message="Access Denied" />;
     }

     if (rejectedRole && rejectedRole.includes(role)) {
          return <FormError message="Access Denied" />;
     }

     return <>{children}</>;
}
