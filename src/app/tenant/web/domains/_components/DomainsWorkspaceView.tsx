"use client";

import React from "react";
import {
  GlobeIcon,
  SearchIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  Loader2Icon,
  CheckCircle2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { DomainsTable } from "./DomainsTable";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DomainsWorkspaceViewProps = {
  userName: string;
  resortName: string;
};

export function DomainsWorkspaceView({ userName, resortName }: DomainsWorkspaceViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isConnectOpen, setIsConnectOpen] = React.useState(false);
  const [domainName, setDomainName] = React.useState("");
  const [connectType, setConnectType] = React.useState<"MANAGED" | "EXTERNAL">("MANAGED");

  const addDomainMutation = useMutation(
    trpc.siteBuilder.addDomain.mutationOptions({
      onSuccess: () => {
        toast.success(connectType === "MANAGED" ? "Domain purchased successfully!" : "Domain connection initiated!");
        setIsConnectOpen(false);
        setDomainName("");
        queryClient.invalidateQueries(trpc.siteBuilder.getDomains.queryOptions());
      },
      onError: (err) => {
        toast.error("Failed to add domain: " + err.message);
      }
    })
  );

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) {
      toast.error("Please enter a domain name");
      return;
    }
    addDomainMutation.mutate({ domain: domainName, type: connectType });
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        message={`Manage your custom domains for ${resortName}. Custom domains help establish your brand and make it easier for guests to find you.`}
        userName={userName}
      />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6 rounded-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <GlobeIcon className="size-3" />
                Domains & DNS
              </Badge>
              <Badge variant="secondary">Global CDN</Badge>
              <Badge variant="secondary">Free SSL</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Web Address
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Manage your custom domain names, subdomains, and DNS settings. Your site is always available on your resort subdomain by default.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => {
              setConnectType("MANAGED");
              setIsConnectOpen(true);
            }}>
              <SearchIcon className="mr-2 size-4" />
              Search domain
            </Button>
            <Button variant="outline" onClick={() => {
              setConnectType("EXTERNAL");
              setIsConnectOpen(true);
            }}>
              Connect existing
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <DomainsTable />
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheckIcon className="size-4 text-primary" />
                </div>
                <h3 className="font-semibold">Automatic SSL</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                We automatically provision and renew SSL certificates for all domains connected to our platform at no extra cost.
              </p>
            </div>
            <div className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ArrowUpRightIcon className="size-4 text-primary" />
                </div>
                <h3 className="font-semibold">Global CDN</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your website is served through our global edge network, ensuring fast loading speeds for guests worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border bg-background p-5 shadow-sm md:p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Domain Status</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium">SSL Provisioned</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Your site is secured with HTTPS.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium">DNS Active</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Traffic is correctly routing to our servers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-2 rounded-full bg-emerald-500 mt-1.5" />
                <div>
                  <p className="text-sm font-medium">Global CDN</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Serving from 240+ edge locations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border bg-background p-5 shadow-sm md:p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Helpful Links</h2>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 justify-start w-full text-primary" asChild>
                <a href="https://help.resortcloud.com/domains/godaddy-connection" target="_blank" rel="noopener noreferrer">
                  How to connect GoDaddy domain <ExternalLinkIcon className="ml-2 size-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 justify-start w-full text-primary" asChild>
                <a href="https://help.resortcloud.com/domains/troubleshooting-dns" target="_blank" rel="noopener noreferrer">
                  Troubleshooting DNS <ExternalLinkIcon className="ml-2 size-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 justify-start w-full text-primary" asChild>
                <a href="https://help.resortcloud.com/domains/email-hosting" target="_blank" rel="noopener noreferrer">
                  Email hosting options <ExternalLinkIcon className="ml-2 size-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 justify-start w-full text-primary" asChild>
                <a href="https://help.resortcloud.com/domains/ssl-certificates" target="_blank" rel="noopener noreferrer">
                  About SSL Certificates <ExternalLinkIcon className="ml-2 size-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 justify-start w-full text-primary" asChild>
                <a href="https://help.resortcloud.com/domains/subdomain-management" target="_blank" rel="noopener noreferrer">
                  Subdomain management <ExternalLinkIcon className="ml-2 size-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Connect/Search Domain Dialog */}
      <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
        <DialogContent className="max-w-125!">
          <DialogHeader>
            <DialogTitle>{connectType === "MANAGED" ? "Search New Domain" : "Connect Existing Domain"}</DialogTitle>
            <DialogDescription>
              {connectType === "MANAGED" 
                ? "Find the perfect address for your resort. We'll handle all the technical setup."
                : "Enter the domain you already own. You'll need to update your DNS records afterward."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConnect}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="domain-name">Domain Name</Label>
                <div className="relative">
                  <Input
                    id="domain-name"
                    placeholder={connectType === "MANAGED" ? "myresort.com" : "example.com"}
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="pl-9"
                  />
                  <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
                {connectType === "MANAGED" && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <CheckCircle2Icon className="mr-1 size-3 text-emerald-500" /> 
                    Includes first year free on Growth/Enterprise plans.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsConnectOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addDomainMutation.isPending}>
                {addDomainMutation.isPending && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                {connectType === "MANAGED" ? "Search & Register" : "Connect Domain"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
