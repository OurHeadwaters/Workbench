import { useAdminMe, useAdminLogin, useAdminLogout } from "@workspace/k-pizza-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const { data, isLoading, refetch } = useAdminMe();
  const qc = useQueryClient();
  const login = useAdminLogin({
    mutation: {
      onSuccess: () => {
        refetch();
        qc.invalidateQueries();
      },
    },
  });
  const logout = useAdminLogout({
    mutation: {
      onSuccess: () => {
        refetch();
        qc.invalidateQueries();
      },
    },
  });
  return {
    isAuthenticated: data?.authenticated ?? false,
    isLoading,
    login: (password: string) => login.mutateAsync({ data: { password } }),
    loginPending: login.isPending,
    loginError: login.error,
    logout: () => logout.mutateAsync(),
  };
}
