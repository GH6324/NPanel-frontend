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
  routingServiceActRoutingGrayRelease,
  routingServiceConfirmRoutingReleaseEnforce,
  routingServiceCreateDnsResolver,
  routingServiceCreateRouteOutbound,
  routingServiceCreateRouteProfile,
  routingServiceCreateRouteRule,
  routingServiceCreateRoutingGrayRelease,
  routingServiceCreateUnlockService,
  routingServiceDeleteDnsResolver,
  routingServiceDeleteRouteOutbound,
  routingServiceDeleteRouteProfile,
  routingServiceDeleteRouteRule,
  routingServiceDeleteUnlockService,
  routingServiceGetRoutingAnalytics,
  routingServiceGetRoutingCapabilityMatrix,
  routingServiceGetRoutingDrilldownReport,
  routingServiceGetRoutingE2EChecklist,
  routingServiceGetRoutingOverview,
  routingServiceGetRoutingReleaseGate,
  routingServiceGetRoutingReleaseReport,
  routingServiceGetRoutingTrendReport,
  routingServiceListDnsResolvers,
  routingServiceListRouteOutbounds,
  routingServiceListRouteProfiles,
  routingServiceListRouteRules,
  routingServiceListRoutingHealthReports,
  routingServiceListRoutingGrayReleases,
  routingServiceListRoutingNotifications,
  routingServiceListRoutingRouteEvents,
  routingServiceListUnlockServices,
  routingServicePreviewRouteConfig,
  routingServiceRollbackRoutingReleaseAudit,
  routingServiceSnapshotRoutingReleaseAudit,
  routingServiceUpdateDnsResolver,
  routingServiceUpdateRouteOutbound,
  routingServiceUpdateRouteProfile,
  routingServiceUpdateRouteRule,
  routingServiceUpdateUnlockService,
} from "@workspace/ui/services/admin/routingService";
import { Link, useSearch } from "@tanstack/react-router";
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

function dateTimeCell(value: unknown) {
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toLocaleString();
    }
  }
  return dateCell(value);
}

function basisPointsCell(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) {
    return "0.00%";
  }
  return `${(parsed / 100).toFixed(2)}%`;
}

function trendBarWidth(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "2%";
  }
  return `${Math.min(100, parsed / 100)}%`;
}

function timestampCell(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "-";
  }
  return new Date(parsed * 1000).toLocaleString();
}

function compactTimestampCell(value: unknown) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "-";
  }
  return new Date(parsed * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const defaultReleaseThresholds: Required<API.RoutingReleaseThresholds> = {
  fallbackRateBp: 500,
  dnsFailRateBp: 500,
  outboundFailRateBp: 500,
  topErrorsMax: 0,
  minRouteEvents: 1,
  minHealthReports: 1,
};

function thresholdQueryParams(thresholds: API.RoutingReleaseThresholds) {
  return {
    fallbackRateBp: String(thresholds.fallbackRateBp ?? 500),
    dnsFailRateBp: String(thresholds.dnsFailRateBp ?? 500),
    outboundFailRateBp: String(thresholds.outboundFailRateBp ?? 500),
    topErrorsMax: String(thresholds.topErrorsMax ?? 0),
    minRouteEvents: String(thresholds.minRouteEvents ?? 1),
    minHealthReports: String(thresholds.minHealthReports ?? 1),
  };
}

function latestRunnableGrayRelease(items: API.RoutingGrayRelease[]) {
  return items.find((item) =>
    ["running", "draft", "paused"].includes(String(item.status || ""))
  );
}

function latestAllowedSnapshot(report?: API.RoutingReleaseReport | null) {
  return (report?.snapshots || []).find((item) => item.allowed);
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

function RoutingTable({
  config,
  initialSearch,
}: {
  config: ResourceConfig;
  initialSearch?: string;
}) {
  const { t } = useTranslation("routing");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  return (
    <ProTable<RoutingItem, { search: string }>
      action={ref}
      actions={{
        render(item) {
          const itemId = item.id == null ? "" : String(item.id);
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
                if (!itemId) {
                  toast.error(t("missingId", "Missing item ID"));
                  return;
                }
                await config.remove(itemId);
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
      initialFilters={initialSearch ? { search: initialSearch } : undefined}
      key={`${config.title}:${initialSearch || ""}`}
      params={[{ key: "search" }]}
      request={async (pagination, filter) =>
        config.list(pagination, filter.search)
      }
    />
  );
}

function PreviewPanel() {
  const { t } = useTranslation("routing");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const [domain, setDomain] = useState("openai.com");
  const [userId, setUserId] = useState(sp.user_id || "");
  const [subscribeId, setSubscribeId] = useState("");
  const [userSubscribeId, setUserSubscribeId] = useState("");
  const [subscribeToken, setSubscribeToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<API.PreviewRouteResult | null>(null);

  const preview = async () => {
    setLoading(true);
    try {
      const { data } = await routingServicePreviewRouteConfig({
        domain,
        userId,
        subscribeId,
        userSubscribeId,
        subscribeToken,
        supportedFeatures: ["route_outbound", "route_dns_resolver", "doh"],
      });
      setResult(data.data || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,460px)_1fr]">
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
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              onChange={(event) => setUserId(event.target.value)}
              placeholder={t("userId", "User ID")}
              value={userId}
            />
            <Input
              onChange={(event) => setSubscribeId(event.target.value)}
              placeholder={t("subscribeId", "Subscribe ID")}
              value={subscribeId}
            />
            <Input
              onChange={(event) => setUserSubscribeId(event.target.value)}
              placeholder={t("userSubscribeId", "User Subscribe ID")}
              value={userSubscribeId}
            />
            <Input
              onChange={(event) => setSubscribeToken(event.target.value)}
              placeholder={t("subscribeToken", "Subscribe Token")}
              value={subscribeToken}
            />
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
            label={t("scope", "Scope")}
            value={
              result?.scopeType
                ? `${result.scopeType}:${result.scopeId || "-"}`
                : "-"
            }
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
  const [rollbacking, setRollbacking] = useState(false);
  const [overview, setOverview] = useState<API.RoutingOverview | null>(null);
  const [reports, setReports] = useState<API.RoutingHealthReport[]>([]);
  const [routeEvents, setRouteEvents] = useState<API.RoutingRouteEvent[]>([]);
  const [analytics, setAnalytics] = useState<API.RoutingAnalyticsData | null>(
    null
  );
  const [releaseGate, setReleaseGate] = useState<API.RoutingReleaseGate | null>(
    null
  );
  const [releaseReport, setReleaseReport] =
    useState<API.RoutingReleaseReport | null>(null);
  const [trendReport, setTrendReport] = useState<API.RoutingTrendReport | null>(
    null
  );
  const [drilldownReport, setDrilldownReport] =
    useState<API.RoutingDrilldownReport | null>(null);
  const [notifications, setNotifications] = useState<API.RoutingNotification[]>(
    []
  );
  const [e2eChecklist, setE2eChecklist] =
    useState<API.RoutingE2EChecklistData | null>(null);
  const [capabilityMatrix, setCapabilityMatrix] =
    useState<API.RoutingCapabilityMatrixData | null>(null);
  const [grayReleases, setGrayReleases] = useState<API.RoutingGrayRelease[]>(
    []
  );
  const [thresholds, setThresholds] = useState<API.RoutingReleaseThresholds>(
    defaultReleaseThresholds
  );

  const loadOverview = async () => {
    setLoading(true);
    try {
      const overviewResp = await routingServiceGetRoutingOverview();
      const latestOverview = overviewResp.data.data || null;
      const profileCode = latestOverview?.profileCode;
      const routingHash = latestOverview?.routingHash;
      const thresholdParams = thresholdQueryParams(thresholds);
      const [
        reportsResp,
        routeEventsResp,
        analyticsResp,
        grayReleasesResp,
        releaseGateResp,
        trendReportResp,
        drilldownReportResp,
        notificationsResp,
        e2eChecklistResp,
        capabilityMatrixResp,
      ] = await Promise.all([
        routingServiceListRoutingHealthReports({ page: "1", size: "6" }),
        routingServiceListRoutingRouteEvents({ page: "1", size: "6" }),
        routingServiceGetRoutingAnalytics({
          profileCode,
          routingHash,
          windowMinutes: "60",
        }),
        routingServiceListRoutingGrayReleases({
          page: "1",
          size: "6",
          profileCode,
        }),
        routingServiceGetRoutingReleaseGate({
          profileCode,
          routingHash,
          windowMinutes: "60",
          ...thresholdParams,
        }),
        routingServiceGetRoutingTrendReport({
          profileCode,
          routingHash,
          windowMinutes: "1440",
          bucketMinutes: "60",
        }),
        routingServiceGetRoutingDrilldownReport({
          profileCode,
          routingHash,
          groupBy: "outbound",
          windowMinutes: "1440",
        }),
        routingServiceListRoutingNotifications({
          profileCode,
          routingHash,
          windowMinutes: "1440",
        }),
        routingServiceGetRoutingE2EChecklist({ profileCode }),
        routingServiceGetRoutingCapabilityMatrix(),
      ]);
      const releases = grayReleasesResp.data.data?.list || [];
      const release = latestRunnableGrayRelease(releases);
      const releaseReportResp = await routingServiceGetRoutingReleaseReport({
        releaseId: release?.id,
        profileCode,
        routingHash,
        windowMinutes: "60",
        ...thresholdParams,
      });
      setOverview(latestOverview);
      setReports(reportsResp.data.data?.list || []);
      setRouteEvents(routeEventsResp.data.data?.list || []);
      setAnalytics(analyticsResp.data.data || null);
      setGrayReleases(releases);
      setReleaseGate(releaseGateResp.data.data || null);
      setReleaseReport(releaseReportResp.data.data || null);
      setTrendReport(trendReportResp.data.data || null);
      setDrilldownReport(drilldownReportResp.data.data || null);
      setNotifications(notificationsResp.data.data?.list || []);
      setE2eChecklist(e2eChecklistResp.data.data || null);
      setCapabilityMatrix(capabilityMatrixResp.data.data || null);
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
  const createGrayRelease = async () => {
    const profileCode = overview?.profileCode;
    if (!profileCode) {
      toast.error(t("missingProfileCode", "Missing profile code"));
      return;
    }
    await routingServiceCreateRoutingGrayRelease({
      release: {
        profileCode,
        name: t("defaultGrayReleaseName", "Default gray release"),
        status: "draft",
        batchNo: 0,
        targetType: "user",
        targetIdsJson: "[]",
        operator: "admin",
        releaseJson: JSON.stringify({ basis: "admin_routing_p9" }),
      },
    });
    toast.success(t("grayReleaseCreated", "Gray release created"));
    await loadOverview();
  };
  const actGrayRelease = async (
    release: API.RoutingGrayRelease,
    action: string
  ) => {
    if (!release.id) {
      toast.error(t("missingId", "Missing item ID"));
      return;
    }
    await routingServiceActRoutingGrayRelease({
      id: release.id,
      action,
      operator: "admin",
      reason:
        action === "rollback"
          ? t("grayRollbackReason", "manual rollback from admin")
          : "",
    });
    toast.success(t("grayActionSuccess", "Gray action saved"));
    await loadOverview();
  };
  const saveAuditSnapshot = async () => {
    const release = latestRunnableGrayRelease(grayReleases);
    if (!release?.id) {
      toast.error(t("missingGrayRelease", "Missing gray release"));
      return;
    }
    await routingServiceSnapshotRoutingReleaseAudit({
      releaseId: release.id,
      profileCode: overview?.profileCode,
      routingHash: overview?.routingHash,
      windowMinutes: "60",
      operator: "admin",
      thresholds,
    });
    toast.success(t("auditSnapshotSaved", "Audit snapshot saved"));
    await loadOverview();
  };
  const confirmEnforce = async () => {
    const release = latestRunnableGrayRelease(grayReleases);
    const snapshot = latestAllowedSnapshot(releaseReport);
    if (!release?.id) {
      toast.error(t("missingGrayRelease", "Missing gray release"));
      return;
    }
    if (!snapshot?.id) {
      toast.error(
        t("missingAllowedSnapshot", "Missing allowed audit snapshot")
      );
      return;
    }
    await routingServiceConfirmRoutingReleaseEnforce({
      releaseId: release.id,
      snapshotId: snapshot.id,
      profileCode: overview?.profileCode,
      routingHash: overview?.routingHash,
      operator: "admin",
      reason: t("confirmEnforceReason", "manual enforce confirmation"),
    });
    toast.success(t("confirmEnforceSuccess", "Enforce confirmed"));
    await loadOverview();
  };
  const updateThreshold = (
    key: keyof API.RoutingReleaseThresholds,
    value: string
  ) => {
    const parsed = Number(value);
    setThresholds((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));
  };
  const rollbackToObserve = async () => {
    const profileCode = overview?.profileCode;
    if (!profileCode) {
      toast.error(t("missingProfileCode", "Missing profile code"));
      return;
    }
    const release = latestRunnableGrayRelease(grayReleases);
    if (!release?.id) {
      toast.error(t("missingGrayRelease", "Missing gray release"));
      return;
    }
    if (overview?.mode === "observe") {
      toast.info(t("rollbackAlreadyObserve", "Profile is already observe"));
      return;
    }
    setRollbacking(true);
    try {
      await routingServiceRollbackRoutingReleaseAudit({
        releaseId: release.id,
        profileCode,
        routingHash: overview?.routingHash,
        windowMinutes: "60",
        operator: "admin",
        reason: t("grayRollbackReason", "manual rollback from admin"),
      });
      toast.success(t("rollbackObserveSuccess", "Rolled back to observe"));
      await loadOverview();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : t("rollbackObserveFailed", "Rollback failed")
      );
    } finally {
      setRollbacking(false);
    }
  };

  return (
    <div className="rounded-md border bg-background p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-lg">
            {t("overview", "Health / Guard")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {overview?.profileCode || "-"} ·{" "}
            {translatedValue(t, "statuses", overview?.mode)} ·{" "}
            {overview?.routingHash || "-"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "rollbackObserveDescription",
              "Switch the current profile mode back to observe."
            )}
            onConfirm={rollbackToObserve}
            title={t("rollbackObserve", "Rollback to observe")}
            trigger={
              <Button
                disabled={rollbacking || loading || !overview?.profileCode}
                size="sm"
                variant="outline"
              >
                <ShieldCheck className="size-4" />
                {t("rollbackObserve", "Rollback to observe")}
              </Button>
            }
          />
          <Button disabled={loading} onClick={loadOverview} variant="outline">
            <RefreshCw className="size-4" />
            {t("refresh", "Refresh")}
          </Button>
        </div>
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

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label={t("affectedReporters", "Affected Reporters")}
          value={String(analytics?.affectedReporters ?? 0)}
        />
        <Metric
          label={t("fallbackRate", "Fallback Rate")}
          value={basisPointsCell(analytics?.fallbackRateBp)}
        />
        <Metric
          label={t("dnsFailRate", "DNS Fail Rate")}
          value={basisPointsCell(analytics?.dnsFailRateBp)}
        />
        <Metric
          label={t("outboundFailRate", "Outbound Fail Rate")}
          value={basisPointsCell(analytics?.outboundFailRateBp)}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div>
          <div className="mb-2 font-medium text-sm">
            {t("trendReport", "Trend Report")}
          </div>
          <div className="grid gap-2">
            {(trendReport?.points || []).length > 0 ? (
              (trendReport?.points || []).slice(-6).map((point) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={String(point.bucketStart)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {compactTimestampCell(point.bucketStart)}
                    </span>
                    <Badge variant="outline">
                      {basisPointsCell(point.fallbackRateBp)}
                    </Badge>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded bg-muted">
                    <div
                      className="h-full rounded bg-primary"
                      style={{ width: trendBarWidth(point.fallbackRateBp) }}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-muted-foreground text-xs">
                    <span>
                      {t("routeEvents", "Route Events")}:{" "}
                      {point.routeEvents ?? 0}
                    </span>
                    <span>
                      {t("routeFallbacks", "Route Fallbacks")}:{" "}
                      {point.routeFallbacks ?? 0}
                    </span>
                    <span>
                      {t("dnsFailures", "DNS Failures")}:{" "}
                      {point.dnsFailures ?? 0}
                    </span>
                    <span>
                      {t("outboundFailures", "Outbound Failures")}:{" "}
                      {point.outboundFailures ?? 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noTrendPoints", "No trend points")}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium text-sm">
            {t("drilldownReport", "Drilldown Report")}
          </div>
          <div className="grid gap-2">
            {(drilldownReport?.items || []).length > 0 ? (
              (drilldownReport?.items || []).slice(0, 6).map((item) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={item.key}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {item.label || item.key || "-"}
                    </span>
                    <Badge variant="outline">
                      {basisPointsCell(item.fallbackRateBp)}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {t("routeEvents", "Route Events")}: {item.routeEvents ?? 0}{" "}
                    · {t("routeFallbacks", "Route Fallbacks")}:{" "}
                    {item.routeFallbacks ?? 0} ·{" "}
                    {t("affectedReporters", "Affected Reporters")}:{" "}
                    {item.affectedReporters ?? 0}
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {t("dnsFailures", "DNS Failures")}: {item.dnsFailures ?? 0}{" "}
                    · {t("outboundFailures", "Outbound Failures")}:{" "}
                    {item.outboundFailures ?? 0} ·{" "}
                    {timestampCell(item.lastSeenAt)}
                  </div>
                  {item.lastError ? (
                    <div className="mt-1 truncate text-muted-foreground text-xs">
                      {item.lastError}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noDrilldownItems", "No drilldown data")}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium text-sm">
            {t("notifications", "Notifications")}
          </div>
          <div className="grid gap-2">
            {notifications.length > 0 ? (
              notifications.slice(0, 6).map((item) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={item.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {item.title || "-"}
                    </span>
                    <Badge variant={severityBadgeVariant(item.severity)}>
                      {translatedValue(t, "alertSeverities", item.severity)}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {item.message || "-"}
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {translatedValue(t, "notificationSources", item.source)} ·{" "}
                    {timestampCell(item.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noNotifications", "No notifications")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-medium text-sm">
          {t("trendMarkers", "Trend Markers")}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {(trendReport?.markers || []).length > 0 ? (
            (trendReport?.markers || []).slice(0, 8).map((marker) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={`${marker.type}:${marker.at}:${marker.operator}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {translatedValue(t, "trendMarkerTypes", marker.type)}
                  </span>
                  <Badge variant="outline">{marker.operator || "-"}</Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {marker.label || "-"}
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {timestampCell(marker.at)}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
              {t("noTrendMarkers", "No trend markers")}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="font-medium text-sm">
            {t("releaseGate", "Release Gate")}
          </div>
          <Badge variant={releaseGate?.allowed ? "default" : "destructive"}>
            {releaseGate?.allowed
              ? t("releaseAllowed", "Allowed")
              : t("releaseBlocked", "Blocked")}
          </Badge>
        </div>
        <div className="mb-2 text-muted-foreground text-sm">
          {releaseGate?.summary || "-"}
        </div>
        <div className="mb-3 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {(
            [
              ["fallbackRateBp", "fallbackThreshold"],
              ["dnsFailRateBp", "dnsThreshold"],
              ["outboundFailRateBp", "outboundThreshold"],
              ["topErrorsMax", "topErrorsMax"],
              ["minRouteEvents", "minRouteEvents"],
              ["minHealthReports", "minHealthReports"],
            ] as [keyof API.RoutingReleaseThresholds, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <Label className="text-xs">{t(label, label)}</Label>
              <Input
                className="mt-1 h-8"
                min={0}
                onChange={(event) => updateThreshold(key, event.target.value)}
                type="number"
                value={String(thresholds[key] ?? 0)}
              />
            </div>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button disabled={loading} onClick={loadOverview} size="sm">
            <RefreshCw className="size-4" />
            {t("recalculate", "Recalculate")}
          </Button>
          <Button
            disabled={loading || !latestRunnableGrayRelease(grayReleases)?.id}
            onClick={saveAuditSnapshot}
            size="sm"
            variant="outline"
          >
            <ShieldCheck className="size-4" />
            {t("saveAuditSnapshot", "Save audit snapshot")}
          </Button>
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "confirmEnforceDescription",
              "Confirm enforce with the latest allowed audit snapshot."
            )}
            onConfirm={confirmEnforce}
            title={t("confirmEnforce", "Confirm enforce")}
            trigger={
              <Button
                disabled={
                  loading ||
                  !latestRunnableGrayRelease(grayReleases)?.id ||
                  !latestAllowedSnapshot(releaseReport)?.id
                }
                size="sm"
                variant="default"
              >
                <ShieldCheck className="size-4" />
                {t("confirmEnforce", "Confirm enforce")}
              </Button>
            }
          />
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {(releaseGate?.checks || []).map((check) => (
            <div
              className="min-w-0 rounded-md border px-3 py-2"
              key={check.key}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-sm">
                  {t(`releaseGateChecks.${check.key}`, {
                    defaultValue: check.label || check.key || "-",
                  })}
                </span>
                <Badge variant={check.passed ? "default" : "destructive"}>
                  {translatedValue(t, "statuses", check.status)}
                </Badge>
              </div>
              <div className="mt-1 truncate text-muted-foreground text-xs">
                {check.reason || "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div>
          <div className="mb-2 font-medium text-sm">
            {t("releaseAlerts", "Release Alerts")}
          </div>
          <div className="grid gap-2">
            {(releaseReport?.alerts || []).length > 0 ? (
              (releaseReport?.alerts || []).map((alert) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={`${alert.severity}:${alert.key}:${alert.message}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {alert.message || alert.key || "-"}
                    </span>
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {translatedValue(t, "alertSeverities", alert.severity)}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {alert.evidence || "-"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noReleaseAlerts", "No release alerts")}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 font-medium text-sm">
            {t("auditSnapshots", "Audit Snapshots")}
          </div>
          <div className="grid gap-2">
            {(releaseReport?.snapshots || []).length > 0 ? (
              (releaseReport?.snapshots || []).slice(0, 5).map((snapshot) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={snapshot.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {snapshot.id || "-"}
                    </span>
                    <Badge
                      variant={snapshot.allowed ? "default" : "destructive"}
                    >
                      {snapshot.allowed
                        ? t("releaseAllowed", "Allowed")
                        : t("releaseBlocked", "Blocked")}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {dateCell(snapshot.createdAt)} · {snapshot.operator || "-"}
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {snapshot.summary || "-"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noAuditSnapshots", "No audit snapshots")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div>
          <div className="mb-2 font-medium text-sm">
            {t("releaseApprovals", "Release Approvals")}
          </div>
          <div className="grid gap-2">
            {(releaseReport?.approvals || []).length > 0 ? (
              (releaseReport?.approvals || []).slice(0, 5).map((approval) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={approval.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {approval.id || "-"}
                    </span>
                    <Badge variant="default">
                      {translatedValue(t, "statuses", "enforce")}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {dateCell(approval.confirmedAt)} ·{" "}
                    {approval.operator || "-"}
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {approval.snapshotId || "-"} · {approval.routingHash || "-"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noReleaseApprovals", "No release approvals")}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 font-medium text-sm">
            {t("rollbackAudits", "Rollback Audits")}
          </div>
          <div className="grid gap-2">
            {(releaseReport?.rollbackAudits || []).length > 0 ? (
              (releaseReport?.rollbackAudits || []).slice(0, 5).map((audit) => (
                <div
                  className="min-w-0 rounded-md border px-3 py-2"
                  key={audit.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-sm">
                      {audit.id || "-"}
                    </span>
                    <Badge variant="outline">
                      {translatedValue(
                        t,
                        "grayStatuses",
                        audit.afterReleaseStatus
                      )}
                    </Badge>
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {dateCell(audit.createdAt)} · {audit.operator || "-"} ·{" "}
                    {translatedValue(t, "statuses", audit.beforeMode)} →{" "}
                    {translatedValue(t, "statuses", audit.afterMode)}
                  </div>
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {audit.summary || audit.reason || "-"}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
                {t("noRollbackAudits", "No rollback audits")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="font-medium text-sm">
              {t("e2eChecklist", "E2E Checklist")}
            </div>
            <Badge variant={e2eChecklist?.ready ? "default" : "outline"}>
              {e2eChecklist?.ready
                ? t("ready", "Ready")
                : t("waiting", "Waiting")}
            </Badge>
          </div>
          <div className="grid gap-2">
            {(e2eChecklist?.items || []).map((item) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={item.key}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {t(`e2eItems.${item.key}`, {
                      defaultValue: item.label || item.key || "-",
                    })}
                  </span>
                  <Badge variant={item.passed ? "default" : "outline"}>
                    {translatedValue(t, "statuses", item.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {item.evidence || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium text-sm">
            {t("capabilityMatrix", "Capability Matrix")}
          </div>
          <div className="grid gap-2">
            {(capabilityMatrix?.items || []).map((item) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={`${item.client}:${item.panel}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {item.client || "-"} · {item.panel || "-"}
                  </span>
                  <Badge
                    variant={item.enforceCandidate ? "default" : "secondary"}
                  >
                    {item.executionMode || "-"}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {item.notes || "-"}
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {(item.supportedFeatures || []).join(", ") || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="font-medium text-sm">
            {t("grayReleases", "Gray Releases")}
          </div>
          <Button
            disabled={loading || !overview?.profileCode}
            onClick={createGrayRelease}
            size="sm"
            variant="outline"
          >
            <Plus className="size-4" />
            {t("createGrayRelease", "Create gray release")}
          </Button>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {grayReleases.length > 0 ? (
            grayReleases.map((release) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={String(release.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {release.name || release.profileCode}
                  </span>
                  <Badge variant={statusBadgeVariant(release.status)}>
                    {translatedValue(t, "grayStatuses", release.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {release.profileCode || "-"} · {t("batchNo", "Batch")}{" "}
                  {release.batchNo ?? 0} ·{" "}
                  {translatedValue(t, "grayTargetTypes", release.targetType)} ·{" "}
                  {release.targetCount ?? 0}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    onClick={() => actGrayRelease(release, "advance")}
                    size="sm"
                    variant="outline"
                  >
                    {t("publishNextBatch", "Next batch")}
                  </Button>
                  <Button
                    onClick={() => actGrayRelease(release, "pause")}
                    size="sm"
                    variant="outline"
                  >
                    {t("pauseGrayRelease", "Pause")}
                  </Button>
                  <ConfirmButton
                    cancelText={t("cancel", "Cancel")}
                    confirmText={t("confirm", "Confirm")}
                    description={t(
                      "rollbackGrayDescription",
                      "Mark this gray release as rolled back."
                    )}
                    onConfirm={() => actGrayRelease(release, "rollback")}
                    title={t("rollbackGrayRelease", "Rollback gray release")}
                    trigger={
                      <Button size="sm" variant="outline">
                        {t("rollback", "Rollback")}
                      </Button>
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
              {t("noGrayReleases", "No gray releases")}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-medium text-sm">
          {t("topErrors", "Top Errors")}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {(analytics?.topErrors || []).length > 0 ? (
            (analytics?.topErrors || []).map((item) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={`${item.kind}:${item.key}:${item.error}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {item.key || item.kind || "-"}
                  </span>
                  <Badge variant="outline">{item.count ?? 0}</Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {item.error || "-"}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
              {t("noTopErrors", "No top errors")}
            </div>
          )}
        </div>
      </div>

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

      <div className="mt-4">
        <div className="mb-2 font-medium text-sm">
          {t("healthReports", "Health Reports")}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={String(report.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {translatedValue(t, "healthKinds", report.subjectType)} ·{" "}
                    {report.subjectKey || "-"}
                  </span>
                  <Badge variant={statusBadgeVariant(report.status)}>
                    {translatedValue(t, "statuses", report.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {translatedValue(t, "reporterTypes", report.reporterType)} ·{" "}
                  {report.reporterId || "-"} · {dateCell(report.checkedAt)}
                </div>
                {report.lastError ? (
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {translatedValue(t, "healthErrors", report.lastError)}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
              {t("noHealthReports", "No health reports")}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-medium text-sm">
          {t("routeEvents", "Route Events")}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {routeEvents.length > 0 ? (
            routeEvents.map((event) => (
              <div
                className="min-w-0 rounded-md border px-3 py-2"
                key={String(event.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {translatedValue(t, "routeEventTypes", event.eventType)} ·{" "}
                    {event.subject || "-"}
                  </span>
                  <Badge variant={statusBadgeVariant(event.status)}>
                    {translatedValue(t, "statuses", event.status)}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {translatedValue(t, "reporterTypes", event.reporterType)} ·{" "}
                  {event.reporterId || "-"} · {dateTimeCell(event.eventAt)}
                </div>
                <div className="mt-1 truncate text-muted-foreground text-xs">
                  {event.ruleName || event.ruleId || "-"} ·{" "}
                  {event.outboundTag || "-"} · {event.dnsResolverTag || "-"}
                </div>
                {event.error ? (
                  <div className="mt-1 truncate text-muted-foreground text-xs">
                    {event.error}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-md border px-3 py-2 text-muted-foreground text-sm">
              {t("noRouteEvents", "No route events")}
            </div>
          )}
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

function severityBadgeVariant(
  severity?: string
): "default" | "secondary" | "destructive" | "outline" {
  if (severity === "critical") return "destructive";
  if (severity === "warning") return "outline";
  if (severity === "info") return "secondary";
  return "outline";
}

export default function RoutingPage() {
  const { t } = useTranslation("routing");
  const sp = useSearch({ strict: false }) as Record<string, string | undefined>;
  const queryUserID = sp.user_id || "";
  const defaultScopeType = queryUserID ? "user" : sp.scope_type || "global";
  const defaultScopeID = queryUserID || sp.scope_id || "default";
  const defaultProfileCode = queryUserID
    ? `p_user_${queryUserID}`
    : "p1_default_smart";
  const defaultProfileName = queryUserID
    ? t("defaults.userProfileName", {
        defaultValue: "User {{userId}} Routing",
        userId: queryUserID,
      })
    : t("defaults.profileName", "P1 Default Smart");

  const resources: Array<{
    value: string;
    config: ResourceConfig;
  }> = [
    {
      value: "profiles",
      config: {
        title: t("profiles", "Profiles"),
        defaultValue: {
          code: defaultProfileCode,
          name: defaultProfileName,
          description: t(
            "defaults.profileDescription",
            "Admin managed routing profile"
          ),
          scopeType: defaultScopeType,
          scopeId: defaultScopeID,
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
      {queryUserID ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            {t("userScopeHint", "Current user scope")}
          </span>
          <Badge variant="outline">user:{queryUserID}</Badge>
          <Button asChild size="sm" variant="outline">
            <Link search={{ user_id: queryUserID }} to="/dashboard/user">
              {t("backToUser", "Back to User")}
            </Link>
          </Button>
        </div>
      ) : null}
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
            <RoutingTable
              config={resource.config}
              initialSearch={resource.value === "profiles" ? queryUserID : ""}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
