"use client";

import React from "react";
import { 
  GlobeIcon, 
  SearchIcon, 
  ExternalLinkIcon, 
  ShieldCheckIcon, 
  PlusIcon,
  Trash2Icon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DomainsTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: domains, isLoading } = useQuery(
    trpc.siteBuilder.getDomains.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.siteBuilder.deleteDomain.mutationOptions({
      onSuccess: () => {
        toast.success("Domain removed");
        queryClient.invalidateQueries(trpc.siteBuilder.getDomains.queryOptions());
      },
      onError: (err) => {
        toast.error("Failed to remove domain: " + err.message);
      }
    })
  );

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <ClockIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!domains || domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
        <GlobeIcon className="size-12 text-muted-foreground opacity-20 mb-4" />
        <h3 className="text-lg font-medium">No domains connected</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          Connect your custom domain to give your resort a professional web address.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-4 text-muted-foreground" />
                  {domain.domain}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {domain.type === "MANAGED" ? "Purchased" : "External"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {domain.status === "ACTIVE" ? (
                    <>
                      <CheckCircle2Icon className="size-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">Live</span>
                    </>
                  ) : domain.status === "PENDING" || domain.status === "CONNECTING" ? (
                    <>
                      <ClockIcon className="size-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">Provisioning</span>
                    </>
                  ) : (
                    <>
                      <AlertCircleIcon className="size-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Error</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(domain.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate({ id: domain.id })}>
                      <Trash2Icon className="mr-2 size-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
