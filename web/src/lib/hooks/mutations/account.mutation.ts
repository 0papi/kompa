import apiClient from "@/lib/apiClient"
import { MUTATION_KEYS } from "@/lib/keys"
import type { CreateFirebaseUserType } from "@/schema/account.schema"
import { useMutation } from "@tanstack/react-query"

export const useAccount = () => {
  const useCreateUser = () => {
    return useMutation({
      mutationKey: [MUTATION_KEYS.user.create],
      mutationFn: (data:CreateFirebaseUserType) => {
        return apiClient.post('/users/register', data)
      }
    })
  }

  return  {
    useCreateUser
  }
}
