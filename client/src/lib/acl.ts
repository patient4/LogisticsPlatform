import { User } from "@/types/schema";

export type UserRole = "admin" | "broker" | "user";

export interface ACLPermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canGeneratePDFs: boolean;
}

export function getUserPermissions(user: User | null): ACLPermissions {
  if (!user) {
    return {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
      canManageUsers: false,
      canViewReports: false,
      canGeneratePDFs: false,
    };
  }

  const role = user.role as UserRole;

  switch (role) {
    case "admin":
      return {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canManageUsers: true,
        canViewReports: true,
        canGeneratePDFs: true,
      };
    
    case "broker":
      return {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canManageUsers: false, // Brokers cannot create users
        canViewReports: true,
        canGeneratePDFs: true,
      };
    
    case "user":
    default:
      return {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        canManageUsers: false,
        canViewReports: true,
        canGeneratePDFs: true, // Users can view/download PDFs only
      };
  }
}

export function hasPermission(user: User | null, permission: keyof ACLPermissions): boolean {
  const permissions = getUserPermissions(user);
  return permissions[permission];
}

export function canAccessResource(user: User | null, resource: string, action: string): boolean {
  const permissions = getUserPermissions(user);
  
  // Special cases for specific resources
  if (resource === "users" && action === "create") {
    return permissions.canManageUsers;
  }
  
  if (resource === "reports" && action === "view") {
    return permissions.canViewReports;
  }
  
  if (resource === "pdf" && action === "generate") {
    return permissions.canGeneratePDFs;
  }
  
  // General CRUD permissions
  switch (action) {
    case "create":
      return permissions.canCreate;
    case "read":
    case "view":
      return permissions.canRead;
    case "update":
    case "edit":
      return permissions.canUpdate;
    case "delete":
      return permissions.canDelete;
    default:
      return false;
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "broker":
      return "Broker";
    case "user":
      return "User";
    default:
      return "Unknown";
  }
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "broker":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "user":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}