import { useAuth } from "./auth-context";

export function useWorkflowGuard(expectedWorkflow: string) {
    const { user } = useAuth();

    if (!user) return false;
    return user.workflow === expectedWorkflow;
}
