"use client";

import React from "react";
import useAdmin from "apps/admin-ui/src/hooks/useAdmin";
import { UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstace";
import { useDispatch } from "react-redux";
import { addManager } from "apps/admin-ui/src/utils/redux/slice/managerSlice";
import { useRouter } from "next/navigation";
import LoadingPage from "@meato/packages/frontend/ui/components/LoadingPage";
import UserRolesPage from "@meato/packages/frontend/ui/components/UserRolesPage";
import RegistrationForm from "@meato/packages/frontend/ui/components/Registerform";

interface ManagerDataType {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  photo: undefined;
}

export default function Page() {
  const { admin, isLoading } = useAdmin();
  const dispatch = useDispatch();
  const router = useRouter();

  if (isLoading) return <LoadingPage />;

  if (typeof window !== "undefined" && !admin) {
    router.push("/sign-in");
    return null;
  }

  const role = admin?.role ?? "user";
  if (role === "user") return <UserRolesPage />;

  const submitMutation = useMutation({
    mutationFn: async (values: ManagerDataType) => {
      try {
        const { data } = await axiosInstance.post(
          "/auth/manager/create-manager",
          values
        );
        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          "Something went wrong. Please try again.";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      dispatch(addManager(data.manager));
      router.push("/managers");
      toast.success(data.message, {
        icon: <UserCheck className="w-6 h-6 mr-3 text-white" />,
        style: { background: "green" },
      });
    },
    onError: (error: any) => {
      toast.error(error.message, {
        icon: <UserX className="w-6 h-6 mr-3 text-white" />,
        style: { background: "red" },
      });
    },
  });

  return (
    <RegistrationForm submitMutation={submitMutation} userType="manager" />
  );
}

export const dynamic = "force-dynamic";