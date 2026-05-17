export type StepDefinition = {
  title: string;
  subtitle: string;
};

export type InvitedMember = {
  initials: string;
  name: string;
  email: string;
  role: string;
  status: "Accepted" | "Pending";
};
