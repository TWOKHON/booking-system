import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";

export enum CredentialType {
  GEMINI = "GEMINI",
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  SLACK = "SLACK",
  DISCORD = "DISCORD",
  HTTP = "HTTP",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  TRELLO = "TRELLO",
  GOOGLE_CALENDAR = "GOOGLE_CALENDAR"
}

export type WorkflowCredential = {
  id: string;
  name: string;
  type: CredentialType;
  provider: string;
  status: "active" | "draft";
};

const CREDENTIALS_QUERY_KEY = ["mock-workflow-credentials"] as const;

let mockCredentials: WorkflowCredential[] = [
  {
    id: "cred-gemini-main",
    name: "Gemini Resort Workspace",
    type: CredentialType.GEMINI,
    provider: "Google Gemini",
    status: "active",
  },
  {
    id: "cred-gemini-staging",
    name: "Gemini Staging",
    type: CredentialType.GEMINI,
    provider: "Google Gemini",
    status: "draft",
  },
  {
    id: "cred-openai-main",
    name: "OpenAI Production",
    type: CredentialType.OPENAI,
    provider: "OpenAI",
    status: "active",
  },
];

const listCredentials = async (type?: CredentialType) => {
  if (!type) {
    return [...mockCredentials];
  }

  return mockCredentials.filter((credential) => credential.type === type);
};

export const useSuspenseCredentials = () => {
  const [params] = useCredentialsParams();

  return useSuspenseQuery({
    queryKey: [...CREDENTIALS_QUERY_KEY, params],
    queryFn: () => listCredentials(),
  });
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: Omit<WorkflowCredential, "id"> & { id?: string },
    ) => {
      const createdCredential: WorkflowCredential = {
        ...input,
        id: input.id ?? `cred-${crypto.randomUUID()}`,
      };

      mockCredentials = [createdCredential, ...mockCredentials];
      return createdCredential;
    },
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" created`);
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to create credential: ${error.message}`);
    },
  });
};

export const useRemoveCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const credential = mockCredentials.find((item) => item.id === id);

      if (!credential) {
        throw new Error("Credential not found");
      }

      mockCredentials = mockCredentials.filter((item) => item.id !== id);
      return credential;
    },
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" removed`);
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to remove credential: ${error.message}`);
    },
  });
};

export const useSuspenseCredential = (id: string) => {
  return useSuspenseQuery({
    queryKey: [...CREDENTIALS_QUERY_KEY, id],
    queryFn: async () =>
      mockCredentials.find((credential) => credential.id === id) ?? null,
  });
};

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<WorkflowCredential> & { id: string }) => {
      const existingCredential = mockCredentials.find(
        (credential) => credential.id === input.id,
      );

      if (!existingCredential) {
        throw new Error("Credential not found");
      }

      const updatedCredential: WorkflowCredential = {
        ...existingCredential,
        ...input,
      };

      mockCredentials = mockCredentials.map((credential) =>
        credential.id === input.id ? updatedCredential : credential,
      );

      return updatedCredential;
    },
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" saved`);
      queryClient.invalidateQueries({ queryKey: CREDENTIALS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(`Failed to save credential: ${error.message}`);
    },
  });
};

export const useCredentialsByType = (type: CredentialType) => {
  return useQuery({
    queryKey: [...CREDENTIALS_QUERY_KEY, type],
    queryFn: () => listCredentials(type),
  });
};
