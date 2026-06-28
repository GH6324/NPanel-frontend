import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Icon } from "@workspace/ui/composed/icon";
import { cn } from "@workspace/ui/lib/utils";
import { getClient, getStat } from "@workspace/ui/services/common/common";
import {
  queryUserSubscribe,
  resetUserSubscribeToken,
} from "@workspace/ui/services/user/user";
import { differenceInDays, formatDate } from "@workspace/ui/utils/formatting";
import { isBrowser } from "@workspace/ui/utils/index";
import { QRCodeCanvas } from "qrcode.react";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useGlobalStore } from "@/stores/global";
import { getPlatform } from "@/utils/common";
import Subscribe from "../../subscribe";
import Renewal from "../../subscribe/renewal";
import ResetTraffic from "../../subscribe/reset-traffic";
import Unsubscribe from "../../subscribe/unsubscribe";
import RedeemCode from "./redeem-code";

type DownloadPlatform = keyof API.DownloadLink;

const platformOptions: Array<{
  fallback: string;
  icon: string;
  key: DownloadPlatform;
  labelKey: string;
}> = [
  {
    fallback: "Windows PC",
    icon: "mdi:microsoft-windows",
    key: "windows",
    labelKey: "platforms.windows",
  },
  {
    fallback: "Mac",
    icon: "uil:apple",
    key: "mac",
    labelKey: "platforms.mac",
  },
  {
    fallback: "Android",
    icon: "uil:android",
    key: "android",
    labelKey: "platforms.android",
  },
  {
    fallback: "iOS",
    icon: "simple-icons:ios",
    key: "ios",
    labelKey: "platforms.ios",
  },
  {
    fallback: "Linux",
    icon: "uil:linux",
    key: "linux",
    labelKey: "platforms.linux",
  },
];

const platforms = platformOptions.map((item) => item.key);

function toNumber(value?: number | string | null) {
  const parsed = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasDownloadLink(
  application: API.SubscribeApplication,
  platform: DownloadPlatform
) {
  return Boolean(application.download_link?.[platform]);
}

export default function Content() {
  const { t } = useTranslation("dashboard");
  const { getUserSubscribe, getAppSubLink } = useGlobalStore();

  const [protocol, setProtocol] = useState("");

  const {
    data: userSubscribe = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });
  const { data: applications } = useQuery({
    queryKey: ["getClient"],
    queryFn: async () => {
      const { data } = await getClient();
      return data.data?.list || [];
    },
  });

  const availablePlatforms = React.useMemo<DownloadPlatform[]>(() => {
    if (!applications || applications.length === 0) return [];

    const platformsSet = new Set<DownloadPlatform>();

    applications.forEach((app) => {
      if (app.download_link) {
        platforms.forEach((platform) => {
          if (app.download_link?.[platform]) {
            platformsSet.add(platform);
          }
        });
      }
    });

    if (platformsSet.size === 0) return platforms;

    return platforms.filter((platform) => platformsSet.has(platform));
  }, [applications]);

  const [platform, setPlatform] = useState<DownloadPlatform>(() => {
    const detectedPlatform =
      getPlatform() === "macos" ? "mac" : (getPlatform() as DownloadPlatform);
    return detectedPlatform;
  });

  const availablePlatformOptions = platformOptions.filter((item) =>
    availablePlatforms.includes(item.key)
  );

  React.useEffect(() => {
    if (
      availablePlatforms.length > 0 &&
      !availablePlatforms.includes(platform)
    ) {
      const firstAvailablePlatform = availablePlatforms[0];
      if (firstAvailablePlatform) {
        setPlatform(firstAvailablePlatform);
      }
    }
  }, [availablePlatforms, platform]);

  const selectedPlatformApplications = React.useMemo(
    () =>
      applications?.filter((application) =>
        hasDownloadLink(application, platform)
      ) || [],
    [applications, platform]
  );

  const currentPlatformOption = platformOptions.find(
    (item) => item.key === platform
  );

  const { data } = useQuery({
    queryKey: ["getStat"],
    queryFn: async () => {
      const { data } = await getStat({
        skipErrorHandler: true,
      });
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const statusWatermarks = {
    2: t("finished", "Finished"),
    3: t("expired", "Expired"),
    4: t("deducted", "Deducted"),
  };

  return (
    <>
      <RedeemCode onSuccess={refetch} />
      {userSubscribe.length ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-semibold">
              <Icon className="size-5" icon="uil:servers" />
              {t("mySubscriptions", "My Subscriptions")}
            </h2>
            <div className="flex gap-2">
              <Button
                className={isLoading ? "animate-pulse" : ""}
                onClick={() => {
                  refetch();
                }}
                size="sm"
                variant="outline"
              >
                <Icon icon="uil:sync" />
              </Button>
              <Button asChild size="sm">
                <Link to="/subscribe">
                  {t("purchaseSubscription", "Purchase Subscription")}
                </Link>
              </Button>
            </div>
          </div>
          {availablePlatforms.length > 0 && (
            <Tabs
              className="w-full max-w-full"
              onValueChange={(value) => setPlatform(value as DownloadPlatform)}
              value={platform}
            >
              <TabsList className="flex h-auto flex-wrap gap-1 p-1">
                {availablePlatformOptions.map((item) => (
                  <TabsTrigger
                    className="gap-1.5 px-2 py-1.5 text-xs lg:px-3"
                    key={item.key}
                    value={item.key}
                  >
                    <Icon className="size-4" icon={item.icon} />
                    <span>{t(item.labelKey, item.fallback)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {userSubscribe.map((item) => {
            const expireTime = toNumber(item.expire_time);
            const resetTime = toNumber(item.reset_time);
            const startTime = toNumber(item.start_time);
            const traffic = toNumber(item.traffic);
            const upload = toNumber(item.upload);
            const download = toNumber(item.download);
            const status = toNumber(item.status);
            // 如果过期时间为0，说明是永久订阅，不应该显示过期状态
            const isActuallyExpired = status === 3 && expireTime !== 0;
            const shouldShowWatermark =
              status === 2 || status === 4 || isActuallyExpired;
            const primarySubscribeUrl =
              getUserSubscribe(item.short, item.token, "")?.[0] || "";
            const manualSubscribeUrls =
              getUserSubscribe(item.short, item.token, protocol) || [];

            return (
              <Card
                className={cn("relative", {
                  "relative opacity-80 grayscale": isActuallyExpired,
                  "relative hidden opacity-60 blur-[0.3px] grayscale":
                    status === 4,
                })}
                key={item.id}
              >
                {shouldShowWatermark && (
                  <div
                    className={cn(
                      "pointer-events-none absolute top-0 left-0 z-10 h-full w-full overflow-hidden mix-blend-difference brightness-150 contrast-200 invert-[0.2]",
                      {
                        "text-destructive": status === 2,
                        "text-white": isActuallyExpired || status === 4,
                      }
                    )}
                  >
                    <div className="absolute inset-0">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        const top = 10 + row * 25 + (col % 2 === 0 ? 5 : -5);
                        const left = 5 + col * 30 + (row % 2 === 0 ? 0 : 10);

                        return (
                          <span
                            className="absolute rotate-[-30deg] whitespace-nowrap font-black text-lg opacity-40 shadow-[0px_0px_1px_rgba(255,255,255,0.5)]"
                            key={i}
                            style={{
                              top: `${top}%`,
                              left: `${left}%`,
                            }}
                          >
                            {
                              statusWatermarks[
                                status as keyof typeof statusWatermarks
                              ]
                            }
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-medium">
                    {item.subscribe.name}
                    <p className="mt-1 text-foreground/50 text-sm">
                      {formatDate(startTime)}
                    </p>
                  </CardTitle>
                  {status !== 4 && (
                    <div className="flex flex-wrap gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            {t("resetSubscription", "Reset Subscription")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("prompt", "Prompt")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t(
                                "confirmResetSubscription",
                                "Are you sure you want to reset your subscription?"
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t("cancel", "Cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await resetUserSubscribeToken({
                                  user_subscribe_id: item.id,
                                });
                                await refetch();
                                toast.success(
                                  t("resetSuccess", "Reset Success")
                                );
                              }}
                            >
                              {t("confirm", "Confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ResetTraffic
                        id={item.id}
                        replacement={item.subscribe.replacement}
                      />
                      {expireTime !== 0 && (
                        <Renewal id={item.id} subscribe={item.subscribe} />
                      )}
                      {status === 1 && (
                        <Unsubscribe
                          allowDeduction={item.subscribe.allow_deduction}
                          id={item.id}
                          onSuccess={refetch}
                        />
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-3 *:flex *:flex-col *:justify-between lg:grid-cols-4">
                    <li>
                      <span className="text-muted-foreground">
                        {t("used", "Used")}
                      </span>
                      <span className="font-bold text-2xl">
                        <Display
                          type="traffic"
                          unlimited={!traffic}
                          value={upload + download}
                        />
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("totalTraffic", "Total Traffic")}
                      </span>
                      <span className="font-bold text-2xl">
                        <Display
                          type="traffic"
                          unlimited={!traffic}
                          value={traffic}
                        />
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("nextResetDays", "Next Reset Days")}
                      </span>
                      <span className="font-semibold text-2xl">
                        {resetTime
                          ? differenceInDays(resetTime, Date.now())
                          : t("noReset", "No Reset")}
                      </span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">
                        {t("expirationDays", "Expiration Days")}
                      </span>
                      <span className="font-semibold text-2xl">
                        {}
                        {expireTime
                          ? differenceInDays(expireTime, Date.now()) ||
                            t("unknown", "Unknown")
                          : t("noLimit", "No Limit")}
                      </span>
                    </li>
                  </ul>
                  <Separator className="mt-4" />
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-sm">
                          {t("quickImport", "Quick Import")}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {currentPlatformOption
                            ? t(
                                "quickImportDescription",
                                "Choose an app for {{platform}} to import this subscription.",
                                {
                                  platform: t(
                                    currentPlatformOption.labelKey,
                                    currentPlatformOption.fallback
                                  ),
                                }
                              )
                            : t(
                                "noAvailableClients",
                                "No available clients are configured yet."
                              )}
                        </p>
                      </div>
                      {primarySubscribeUrl && (
                        <CopyToClipboard
                          onCopy={(_, result) => {
                            if (result) {
                              toast.success(t("copySuccess", "Copy Success"));
                            }
                          }}
                          text={primarySubscribeUrl}
                        >
                          <Button size="sm" variant="outline">
                            <Icon className="mr-1 size-4" icon="uil:copy" />
                            {t("copySubscription", "Copy Link")}
                          </Button>
                        </CopyToClipboard>
                      )}
                    </div>
                    {selectedPlatformApplications.length > 0 &&
                    primarySubscribeUrl ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {selectedPlatformApplications.map((application) => {
                          const downloadUrl =
                            application.download_link?.[platform];
                          const importUrl = application.scheme
                            ? getAppSubLink(
                                primarySubscribeUrl,
                                application.scheme
                              )
                            : "";

                          const handleCopy = (_: string, result: boolean) => {
                            if (result) {
                              const showSuccessMessage = () => {
                                toast.success(
                                  <>
                                    <p>{t("copySuccess", "Copy Success")}</p>
                                    <br />
                                    <p>
                                      {t(
                                        "manualImportMessage",
                                        "Please import manually"
                                      )}
                                    </p>
                                  </>
                                );
                              };

                              if (isBrowser() && importUrl) {
                                window.location.href = importUrl;
                                const checkRedirect = setTimeout(() => {
                                  if (window.location.href !== importUrl) {
                                    showSuccessMessage();
                                  }
                                  clearTimeout(checkRedirect);
                                }, 1000);
                                return;
                              }

                              showSuccessMessage();
                            }
                          };

                          return (
                            <div
                              className="flex items-center gap-3 rounded-lg border bg-card p-3"
                              key={application.name}
                            >
                              <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                                {application.icon ? (
                                  <img
                                    alt={application.name}
                                    className="size-10 object-contain"
                                    height={40}
                                    src={application.icon}
                                    width={40}
                                  />
                                ) : (
                                  <Icon
                                    className="size-6 text-muted-foreground"
                                    icon="uil:apps"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-sm">
                                  {application.name}
                                </p>
                                <p className="truncate text-muted-foreground text-xs">
                                  {currentPlatformOption
                                    ? t(
                                        currentPlatformOption.labelKey,
                                        currentPlatformOption.fallback
                                      )
                                    : ""}
                                </p>
                              </div>
                              <div className="flex flex-shrink-0 items-center">
                                {downloadUrl && (
                                  <Button
                                    asChild
                                    className={
                                      application.scheme
                                        ? "rounded-r-none px-2"
                                        : "px-2"
                                    }
                                    size="sm"
                                    variant="secondary"
                                  >
                                    <a
                                      href={downloadUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {t("download", "Download")}
                                    </a>
                                  </Button>
                                )}
                                {application.scheme && importUrl && (
                                  <CopyToClipboard
                                    onCopy={handleCopy}
                                    text={importUrl}
                                  >
                                    <Button
                                      className={
                                        downloadUrl
                                          ? "rounded-l-none px-2"
                                          : "px-2"
                                      }
                                      size="sm"
                                    >
                                      {t("import", "Import")}
                                    </Button>
                                  </CopyToClipboard>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed p-4 text-muted-foreground text-sm">
                        {t(
                          "noAvailableClients",
                          "No available clients are configured yet."
                        )}
                      </div>
                    )}
                  </div>
                  <Accordion className="mt-4 w-full" collapsible type="single">
                    <AccordionItem value="manual-import">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" icon="uil:link" />
                          <span className="font-medium text-sm">
                            {t("manualImport", "Manual Import")}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {data?.protocol && data?.protocol.length > 1 && (
                            <Tabs onValueChange={setProtocol} value={protocol}>
                              <TabsList className="flex h-auto flex-wrap gap-1 p-1">
                                {["all", ...(data?.protocol || [])].map(
                                  (item) => (
                                    <TabsTrigger
                                      className="px-2 uppercase lg:px-3"
                                      key={item}
                                      value={item === "all" ? "" : item}
                                    >
                                      {item === "all" ? t("all", "All") : item}
                                    </TabsTrigger>
                                  )
                                )}
                              </TabsList>
                            </Tabs>
                          )}
                          {manualSubscribeUrls.map((url, index) => (
                            <div className="rounded-lg border p-3" key={url}>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="font-medium text-sm">
                                  {t("subscriptionUrl", "Subscription URL")}{" "}
                                  {index + 1}
                                </CardTitle>
                                <CopyToClipboard
                                  onCopy={(_, result) => {
                                    if (result) {
                                      toast.success(
                                        t("copySuccess", "Copy Success")
                                      );
                                    }
                                  }}
                                  text={url}
                                >
                                  <Button size="sm" variant="outline">
                                    <Icon
                                      className="mr-1 size-4"
                                      icon="uil:copy"
                                    />
                                    {t("copy", "Copy")}
                                  </Button>
                                </CopyToClipboard>
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-4">
                                <div className="hidden flex-col items-center gap-2 text-muted-foreground text-sm lg:flex">
                                  <QRCodeCanvas
                                    bgColor="transparent"
                                    fgColor="rgb(59, 130, 246)"
                                    size={80}
                                    value={url}
                                  />
                                  <span className="text-center">
                                    {t("scanToSubscribe", "Scan to Subscribe")}
                                  </span>
                                </div>
                                <p className="min-w-0 flex-1 break-all rounded-md bg-muted p-3 text-muted-foreground text-xs">
                                  {url}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <>
          <h2 className="flex items-center gap-1.5 font-semibold">
            <Icon className="size-5" icon="uil:shop" />
            {t("purchaseSubscription", "Purchase Subscription")}
          </h2>
          <Subscribe />
        </>
      )}
    </>
  );
}
