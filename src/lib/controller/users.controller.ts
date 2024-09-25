import { cookies } from "next/headers";
import { API, URLS } from "../consts";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/options";

export const getUsers = async (o: {
  page?: string;
  limit?: string;
  type?: "admins" | "agents";
  blacklisted?: boolean;
}) => {
  const session = await getServerSession(options);
  const headers = {
    "Content-Type": "application/json",
    "api-secret": process.env.API_SECRET || "",
    Authorization: `Bearer ${session?.user.access_token}`,
  };
  const url = `${API}${URLS.user}${o.type ? "/" + o.type : ""}?page=${
    o.page ?? 1
  }&limit=${o.limit ?? 15}${
    o.blacklisted ? "&is_blacklisted=" + String(o.blacklisted) : ""
  }`;
  const res = await fetch(url, { headers, next: { revalidate: 0 } });
  const result = await res.json();
  if (!result.status) return undefined;
  const admins: {
    rows: IAdmin[];
    meta: { total: number; total_pages: number; page: number };
  } = result.data;
  return admins;
};
export const getUser = async (id: string) => {
  try {
    const session = await getServerSession(options);
    const headers = {
      "Content-Type": "application/json",
      "api-secret": process.env.API_SECRET || "",
      Authorization: `Bearer ${session?.user.access_token}`,
    };
    const url = `${API}${URLS.user}/${id}`;
    const res = await fetch(url, { headers, next: { revalidate: 0 } });
    const result = await res.json();
    if (!result.status) return undefined;
    const user: IUserExtended = result.data;
    return user;
  } catch {
    return null;
  }
};
