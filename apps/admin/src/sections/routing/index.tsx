import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  routingServiceCreateDnsResolver,
  routingServiceCreateRouteOutbound,
  routingServiceCreateRouteProfile,
  routingServiceCreateRouteRule,
  routingServiceCreateUnlockService,
  routingServiceDeleteDnsResolver,
  routingServiceDeleteRouteOutbound,
  routingServiceDeleteRouteProfile,
  routingServiceDeleteRouteRule,
  routingServiceDeleteUnlockService,
  routingServiceGetRoutingOverview,
  routingServiceListDnsResolvers,
  routingServiceListRouteOutbounds,
  routingServiceListRouteProfiles,
  routingServiceListRouteRules,
  routingServiceListUnlockServices,
  routingServicePreviewRouteConfig,
  routingServiceUpdateDnsResolver,
  routingServiceUpdateRouteOutbound,
  routingServiceUpdateRouteProfile,
  routingServiceUpdateRouteRule,
  routingServiceUpdateUnlockService,
} from "@workspace/ui/services/admin/routingService";
import type { TFunction } from "i18next";
import {
  Activity,
  Check,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { formatDate } from "@/utils/common";

type RoutingItem = {
  id?: string;
  enabled?: boolean;
  updatedAt?: string;
  [key: string]: unknown;
};

type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "json";
  required?: boolean;
};

type ResourceConfig = {
  title: string;
  fields: FieldConfig[];
  defaultValue: RoutingItem;
  list: (
    pagination: { page?: number; size?: number },
    search?: string
  ) => Promise<{ list: RoutingItem[]; total: number }>;
  create: (item: RoutingItem) => Promise<unknown>;
  update: (item: RoutingItem) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
};

const profileJSON = JSON.stringify(
  {
    default_action: { type: "proxy" },
    default_dns_resolver_tag: "dns:cloudflare-doh",
    default_fallback_policy: "fallback_default",
  },
  null,
  2
);

const matcherJSON = JSON.stringify(
  { type: "domain_suffix", value: "openai.com" },
  null,
  2
);

const actionJSON = JSON.stringify(
  {
    type: "outbound",
    outbound_tag: "unlock:openai:us",
    dns_resolver_tag: "dns:cloudflare-doh",
    fail_policy: "fallback_default",
  },
  null,
  2
);

const resolverJSON = JSON.stringify(
  {
    path: "/dns-query",
    server_name: "cloudflare-dns.com",
    bootstrap: ["1.1.1.1", "1.0.0.1"],
    detour: { type: "proxy" },
    timeout_ms: 3000,
    retry: 2,
    cache_ttl_seconds: 300,
    health_check: { enabled: true, domain: "www.cloudflare.com" },
  },
  null,
  2
);

const outboundJSON = JSON.stringify(
  {
    node_group_id: "preview",
    service_tags: ["openai"],
    selection_policy: "health_first",
    fail_policy: "fallback_default",
    fallback_pool_tags: ["proxy:default"],
    health_check: {
      enabled: true,
      url: "https://chat.openai.com/cdn-cgi/trace",
      interval_seconds: 60,
      timeout_ms: 5000,
    },
  },
  null,
  2
);

const serviceJSON = JSON.stringify(
  {
    regions: ["US"],
    default_region: "US",
    default_outbound_tag: "unlock:openai:us",
    default_dns_resolver_tag: "dns:cloudflare-doh",
    default_fail_policy: "fallback_default",
    health_check_url: "https://chat.openai.com/cdn-cgi/trace",
  },
  null,
  2
);

function dateCell(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? formatDate(parsed) : "-";
}

function toRequestParams(pagination: { page?: number; size?: number }) {
  return {
    page: String(pagination.page ?? 1),
    size: String(pagination.size ?? 10),
  };
}

function validateJSON(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }
  try {
    JSON.parse(value || "{}");
    return true;
  } catch {
    return false;
  }
}

function translatedValue(t: TFunction, namespace: string, value?: string) {
  if (!value) {
    return "-";
  }
  return t(`${namespace}.${value}`, { defaultValue: value });
}

function translatedBoolean(t: TFunction, value?: boolean) {
  if (typeof value !== "boolean") {
    return "-";
  }
  return value ? t("yes", "Yes") : t("no", "No");
}

function translatedGuardReason(t: TFunction, guard: API.RoutingEnforceGuard) {
  if (guard.passed || guard.reason === "passed") {
    return t("guardReasons.passed", "passed");
  }
  if (!guard.reason) {
    return "-";
  }
  return t(`guardReasons.${guard.key}`, { defaultValue: guard.reason });
}

function RoutingForm({
  config,
  initialValues,
  loading,
  onSubmit,
}: {
  config: ResourceConfig;
  initialValues?: RoutingItem;
  loading: boolean;
  onSubmit: (values: RoutingItem) => Promise<boolean>;
}) {
  const { t } = useTranslation("routing");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<RoutingItem>(
    initialValues || config.defaultValue
  );
  const editing = Boolean(initialValues?.id);

  const submit = async () => {
    const hasInvalidJSON = config.fields.some(
      (field) => field.type === "json" && !validateJSON(values[field.key])
    );
    if (hasInvalidJSON) {
      toast.error(t("invalidJson", "Invalid JSON"));
      return;
    }
    const ok = await onSubmit(values);
    if (ok) {
      setOpen(false);
      setValues(initialValues || config.defaultValue);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant={editing ? "outline" : "default"}>
          {editing ? (
            <Pencil className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {editing ? t("edit", "Edit") : t("create", "Create")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? t("editTitle", "Edit") : t("createTitle", "Create")}{" "}
            {config.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map((field) => {
            const value = values[field.key];
            if (field.type === "json") {
              return (
                <div className="md:col-span-2" key={String(field.key)}>
                  <Label>{field.label}</Label>
                  <Textarea
                    className="mt-2 min-h-44 font-mono text-xs"
                    onChange={(event) =>
                      setValues({
                        ...values,
                        [field.key]: event.target.value,
                      })
                    }
                    value={String(value ?? "")}
                  />
                </div>
              );
            }
            return (
              <div key={String(field.key)}>
                <Label>{field.label}</Label>
                <Input
                  className="mt-2"
                  onChange={(event) =>
                    setValues({
                      ...values,
                      [field.key]:
                        field.type === "number"
                          ? Number(event.target.value)
                          : event.target.value,
                    })
                  }
                  type={field.type === "number" ? "number" : "text"}
                  value={String(value ?? "")}
                />
              </div>
            );
          })}
          <div className="flex items-center gap-3">
            <Switch
              checked={Boolean(values.enabled)}
              onCheckedChange={(checked) =>
                setValues({ ...values, enabled: checked })
              }
            />
            <Label>{t("enabled", "Enabled")}</Label>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={submit}>
            <Check className="size-4" />
            {t("save", "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoutingTable({ config }: { config: ResourceConfig }) {
  const { t } = useTranslation("routing");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<RoutingItem, { search: string }>
      action={ref}
      actions={{
        render(row) {
          const item = row.original as RoutingItem;
          return [
            <RoutingForm
              config={config}
              initialValues={item}
              key="edit"
              loading={loading}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await config.update({ ...item, ...values });
                  toast.success(t("saveSuccess", "Saved successfully"));
                  ref.current?.refresh();
                  return true;
                } finally {
                  setLoading(false);
                }
              }}
            />,
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "deleteDescription",
                "This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await config.remove(String(item.id));
                toast.success(t("deleteSuccess", "Deleted successfully"));
                ref.current?.refresh();
              }}
              title={t("confirmDelete", "Confirm Delete")}
              trigger={
                <Button size="sm" variant="destructive">
                  <Trash2 className="size-4" />
                  {t("delete", "Delete")}
                </Button>
              }
            />,
          ];
        },
      }}
      columns={[
        {
          accessorKey: "enabled",
          header: t("enabled", "Enabled"),
          cell: ({ row }) => (
            <Switch
              checked={Boolean(row.original.enabled)}
              onCheckedChange={async (checked) => {
                await config.update({ ...row.original, enabled: checked });
                ref.current?.refresh();
              }}
            />
          ),
        },
        {
          accessorKey: "id",
          header: "ID",
          cell: ({ row }) => (
            <Badge variant="outline">{String(row.original.id)}</Badge>
          ),
        },
        ...config.fields
          .filter((field) => field.type !== "json")
          .map((field) => ({
            accessorKey: String(field.key),
            header: field.label,
          })),
        {
          accessorKey: "updatedAt",
          header: t("updatedAt", "Updated At"),
          cell: ({ row }) => dateCell(row.original.updatedAt),
        },
      ]}
      header={{
        title: config.title,
        toolbar: (
          <RoutingForm
            config={config}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                await config.create(values);
                toast.success(t("saveSuccess", "Saved successfully"));
                ref.current?.refresh();
                return true;
              } finally {
                setLoading(false);
              }
            }}
          />
        ),
      }}
      params={[{ key: "search" }]}
      request={async (pagination, filter) =>
        config.list(pagination, filter.search)
      }
    />
  );
}

function PreviewPanel() {
  const { t } = useTranslation("routing");
  const [domain, setDomain] = useState("openai.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<API.PreviewRouteResult | null>(null);

  const preview = async () => {
    setLoading(true);
    try {
      const { data } = await routingServicePreviewRouteConfig({
        domain,
        supportedFeatures: ["route_outbound", "route_dns_resolver", "doh"],
      });
      setResult(data.data || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="space-y-3">
          <Label>{t("domain", "Domain")}</Label>
          <div className="flex gap-2">
            <Input
              onChange={(event) => setDomain(event.target.value)}
              value={domain}
            />
            <Button disabled={loading} onClick={preview}>
              <Eye className="size-4" />
              {t("preview", "Preview")}
            </Button>
          </div>
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2 xl:grid-cols-4">
          <Metric
            label={t("profile", "Profile")}
            value={result?.profileCode || "-"}
          />
          <Metric label={t("rule", "Rule")} value={result?.ruleName || "-"} />
          <Metric
            label={t("dnsResolver", "DNS Resolver")}
            value={result?.dnsResolverTag || "-"}
          />
          <Metric
            label={t("outbound", "Outbound")}
            value={result?.outboundTag || "-"}
          />
          <Metric
            label={t("fallback", "Fallback")}
            value={result?.fallbackPolicy || "-"}
          />
          <Metric
            label={t("mode", "Mode")}
            value={translatedValue(t, "statuses", result?.effectiveMode)}
          />
          <Metric
            label={t("matched", "Matched")}
            value={result ? translatedBoolean(t, Boolean(result.matched)) : "-"}
          />
          <Metric
            label={t("routingHash", "Routing Hash")}
            value={result?.routingHash || "-"}
          />
        </div>
      </div>
    </div>
  );
}

function RoutingOverviewPanel() {
  const { t } = useTranslation("routing");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<API.RoutingOverview | null>(null);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const { data } = await routingServiceGetRoutingOverview();
      setOverview(data.data || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const guards = overview?.guards || [];
  const health = overview?.health || [];
  const auditEvents = overview?.auditEvents || [];

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-lg">
            {t("p4Overview", "P4 Health / Guard")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {overview?.profileCode || "-"} ·{" "}
            {translatedValue(t, "statuses", overview?.mode)} ·{" "}
            {overview?.routingHash || "-"}
          </p>
        </div>
        <Button disabled={loading} onClick={loadOverview} variant="outline">
          <RefreshCw className="size-4" />
          {t("refresh", "Refresh")}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label={t("profile", "Profile")}
          value={overview?.profileName || overview?.profileCode || "-"}
        />
        <Metric
          label={t("mode", "Mode")}
          value={translatedValue(t, "statuses", overview?.mode)}
        />
        <Metric
          label={t("enforceReady", "Enforce Ready")}
          value={
            overview
              ? translatedBoolean(t, Boolean(overview.enforceReady))
              : "-"
          }
        />
        <Metric
          label={t("rollback", "Rollback")}
          value={overview?.rollbackAction || "-"}
        />
      </div>

      {overview?.compileError ? (
        <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
          {overview.compileError}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 font-medium text-sm">
            <ShieldCheck className="size-4" />
            {t("enforceGuard", "Enforce Guard")}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {guards.map((guard) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={guard.key}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {t(`guardLabels.${guard.key}`, {
                      defaultValue: guard.label || guard.key || "-",
                    })}
                  </span>
                  <Badge variant={guard.passed ? "default" : "outline"}>
                    {translatedValue(t, "statuses", guard.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {translatedGuardReason(t, guard)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 font-medium text-sm">
            <Activity className="size-4" />
            {t("healthSnapshot", "Health Snapshot")}
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {health.map((item) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={`${item.kind}:${item.key}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {item.name || item.key}
                  </span>
                  <Badge variant={statusBadgeVariant(item.status)}>
                    {translatedValue(t, "statuses", item.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {translatedValue(t, "healthKinds", item.kind)} ·{" "}
                  {translatedValue(t, "sources", item.source)} ·{" "}
                  {dateCell(item.checkedAt)}
                </div>
                {item.lastError ? (
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {translatedValue(t, "healthErrors", item.lastError)}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-medium text-sm">
          {t("auditSnapshot", "Audit Snapshot")}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {auditEvents.map((event) => (
            <div className="min-w-0 rounded-md border px-3 py-2" key={event.id}>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-sm">
                  {event.resourceName || event.resourceId}
                </span>
                <Badge variant="outline">
                  {translatedValue(t, "auditResourceTypes", event.resourceType)}
                </Badge>
              </div>
              <div className="mt-1 truncate text-muted-foreground text-xs">
                {translatedValue(t, "auditActions", event.action)} ·{" "}
                {event.summary || "-"}
              </div>
              <div className="mt-1 text-muted-foreground text-xs">
                {dateCell(event.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border px-3 py-2">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="truncate font-medium">{value}</div>
    </div>
  );
}

function statusBadgeVariant(
  status?: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "healthy" || status === "ok") return "default";
  if (status === "failed" || status === "degraded") return "destructive";
  if (status === "disabled") return "secondary";
  return "outline";
}

export default function RoutingPage() {
  const { t } = useTranslation("routing");

  const resources: Array<{
    value: string;
    config: ResourceConfig;
  }> = [
    {
      value: "profiles",
      config: {
        title: t("profiles", "Profiles"),
        defaultValue: {
          code: "p1_default_smart",
          name: t("defaults.profileName", "P1 Default Smart"),
          description: t(
            "defaults.profileDescription",
            "Admin managed routing profile"
          ),
          scopeType: "global",
          scopeId: "default",
          priority: 100,
          mode: "observe",
          enabled: true,
          profileJson: profileJSON,
        },
        fields: [
          { key: "code", label: t("code", "Code"), required: true },
          { key: "name", label: t("name", "Name"), required: true },
          { key: "description", label: t("description", "Description") },
          { key: "scopeType", label: t("scopeType", "Scope Type") },
          { key: "scopeId", label: t("scopeId", "Scope ID") },
          {
            key: "priority",
            label: t("priority", "Priority"),
            type: "number",
          },
          { key: "mode", label: t("mode", "Mode") },
          {
            key: "profileJson",
            label: t("profileJson", "Profile JSON"),
            type: "json",
          },
        ],
        list: async (pagination, search) => {
          const { data } = await routingServiceListRouteProfiles({
            ...toRequestParams(pagination),
            search,
          });
          return { list: data.data?.list || [], total: data.data?.total || 0 };
        },
        create: (profile) => routingServiceCreateRouteProfile({ profile }),
        update: (profile) => routingServiceUpdateRouteProfile({ profile }),
        remove: (id) => routingServiceDeleteRouteProfile({ id }),
      },
    },
    {
      value: "rules",
      config: {
        title: t("rules", "Rules"),
        defaultValue: {
          profileId: "0",
          name: t("defaults.openaiRuleName", "OpenAI route"),
          priority: 200,
          enabled: true,
          serviceCode: "openai",
          matcherJson: matcherJSON,
          actionJson: actionJSON,
        },
        fields: [
          { key: "profileId", label: t("profileId", "Profile ID") },
          { key: "name", label: t("name", "Name"), required: true },
          {
            key: "priority",
            label: t("priority", "Priority"),
            type: "number",
          },
          { key: "serviceCode", label: t("serviceCode", "Service Code") },
          {
            key: "matcherJson",
            label: t("matcherJson", "Matcher JSON"),
            type: "json",
          },
          {
            key: "actionJson",
            label: t("actionJson", "Action JSON"),
            type: "json",
          },
        ],
        list: async (pagination, search) => {
          const { data } = await routingServiceListRouteRules({
            ...toRequestParams(pagination),
            search,
          });
          return { list: data.data?.list || [], total: data.data?.total || 0 };
        },
        create: (rule) => routingServiceCreateRouteRule({ rule }),
        update: (rule) => routingServiceUpdateRouteRule({ rule }),
        remove: (id) => routingServiceDeleteRouteRule({ id }),
      },
    },
    {
      value: "dns",
      config: {
        title: t("dnsResolvers", "DNS Resolvers"),
        defaultValue: {
          tag: "dns:cloudflare-doh",
          name: t("defaults.cloudflareDohName", "Cloudflare DoH"),
          proto: "doh",
          address: "https://cloudflare-dns.com/dns-query",
          port: 443,
          enabled: true,
          resolverJson: resolverJSON,
        },
        fields: [
          { key: "tag", label: t("tag", "Tag"), required: true },
          { key: "name", label: t("name", "Name"), required: true },
          { key: "proto", label: t("proto", "Proto") },
          { key: "address", label: t("address", "Address") },
          { key: "port", label: t("port", "Port"), type: "number" },
          {
            key: "resolverJson",
            label: t("resolverJson", "Resolver JSON"),
            type: "json",
          },
        ],
        list: async (pagination, search) => {
          const { data } = await routingServiceListDnsResolvers({
            ...toRequestParams(pagination),
            search,
          });
          return { list: data.data?.list || [], total: data.data?.total || 0 };
        },
        create: (resolver) => routingServiceCreateDnsResolver({ resolver }),
        update: (resolver) => routingServiceUpdateDnsResolver({ resolver }),
        remove: (id) => routingServiceDeleteDnsResolver({ id }),
      },
    },
    {
      value: "outbounds",
      config: {
        title: t("outbounds", "Outbounds"),
        defaultValue: {
          tag: "unlock:openai:us",
          name: t("defaults.openaiOutboundName", "OpenAI US"),
          type: "node_group",
          region: "US",
          enabled: true,
          outboundJson: outboundJSON,
        },
        fields: [
          { key: "tag", label: t("tag", "Tag"), required: true },
          { key: "name", label: t("name", "Name"), required: true },
          { key: "type", label: t("type", "Type") },
          { key: "region", label: t("region", "Region") },
          {
            key: "outboundJson",
            label: t("outboundJson", "Outbound JSON"),
            type: "json",
          },
        ],
        list: async (pagination, search) => {
          const { data } = await routingServiceListRouteOutbounds({
            ...toRequestParams(pagination),
            search,
          });
          return { list: data.data?.list || [], total: data.data?.total || 0 };
        },
        create: (outbound) => routingServiceCreateRouteOutbound({ outbound }),
        update: (outbound) => routingServiceUpdateRouteOutbound({ outbound }),
        remove: (id) => routingServiceDeleteRouteOutbound({ id }),
      },
    },
    {
      value: "services",
      config: {
        title: t("unlockServices", "Unlock Services"),
        defaultValue: {
          code: "openai",
          name: "OpenAI",
          category: "ai",
          enabled: true,
          serviceJson: serviceJSON,
        },
        fields: [
          { key: "code", label: t("code", "Code"), required: true },
          { key: "name", label: t("name", "Name"), required: true },
          { key: "category", label: t("category", "Category") },
          {
            key: "serviceJson",
            label: t("serviceJson", "Service JSON"),
            type: "json",
          },
        ],
        list: async (pagination, search) => {
          const { data } = await routingServiceListUnlockServices({
            ...toRequestParams(pagination),
            search,
          });
          return { list: data.data?.list || [], total: data.data?.total || 0 };
        },
        create: (service) => routingServiceCreateUnlockService({ service }),
        update: (service) => routingServiceUpdateUnlockService({ service }),
        remove: (id) => routingServiceDeleteUnlockService({ id }),
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-2xl">{t("routing", "Routing")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("subtitle", "Admin routing profile management")}
          </p>
        </div>
        <Badge variant="secondary">routing_profile.v1</Badge>
      </div>
      <PreviewPanel />
      <RoutingOverviewPanel />
      <Tabs defaultValue="profiles">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {resources.map((resource) => (
            <TabsTrigger key={resource.value} value={resource.value}>
              {resource.config.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {resources.map((resource) => (
          <TabsContent
            className="pt-4"
            key={resource.value}
            value={resource.value}
          >
            <RoutingTable config={resource.config} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
