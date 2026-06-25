import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Icon } from "@workspace/ui/composed/icon";
import { getUserTrafficStats } from "@workspace/ui/services/user/traffic";
import { queryUserSubscribe } from "@workspace/ui/services/user/user";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TrafficRatioChart from "./traffic-ratio-chart";
import TrafficStatsCards from "./traffic-stats-cards";
import TrafficTrendChart from "./traffic-trend-chart";

function toNumber(value?: number | string | null) {
  const parsed = typeof value === "string" ? Number(value) : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSubscribeId(
  subscribe?: API.UserSubscribe & { id_str?: string | number | null }
) {
  const id = subscribe?.id_str ?? subscribe?.id;
  return id === undefined || id === null ? null : String(id);
}

function getTrafficTotal(
  stats: API.GetUserTrafficStatsReply | null | undefined,
  key: "total_upload" | "total_download"
) {
  const camelKey = key === "total_upload" ? "totalUpload" : "totalDownload";
  return toNumber(stats?.[key] ?? stats?.[camelKey]);
}

export default function TrafficStatistics() {
  const { t } = useTranslation("traffic");
  const [days, setDays] = useState<7 | 30>(7);
  const [selectedSubscribeId, setSelectedSubscribeId] = useState<string | null>(
    null
  );

  // 查询用户订阅列表
  const { data: userSubscribe = [] } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });

  const activeSubscribeId =
    selectedSubscribeId || getSubscribeId(userSubscribe[0]);

  // 查询流量统计数据
  const { data: trafficStats, isLoading } = useQuery({
    queryKey: ["getUserTrafficStats", activeSubscribeId, days],
    queryFn: async () => {
      if (!activeSubscribeId) return null;
      const { data } = await getUserTrafficStats({
        userSubscribeId: activeSubscribeId,
        user_subscribe_id: activeSubscribeId,
        days,
      });
      return data.data;
    },
    enabled: !!activeSubscribeId,
  });

  return (
    <div className="flex min-h-[calc(100vh-64px-58px-32px-114px)] w-full flex-col gap-4">
      {/* 标题和控制栏 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-1.5 font-semibold">
          <Icon className="size-5" icon="uil:chart-line" />
          {t("title", "Traffic Statistics")}
        </h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* 订阅选择 */}
          {userSubscribe.length > 1 && (
            <Select
              onValueChange={(value) => setSelectedSubscribeId(value)}
              value={activeSubscribeId || undefined}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue
                  placeholder={t("selectSubscription", "Select Subscription")}
                />
              </SelectTrigger>
              <SelectContent>
                {userSubscribe.map((sub) => (
                  <SelectItem key={sub.id} value={getSubscribeId(sub) ?? ""}>
                    {sub.subscribe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {/* 时间范围切换 */}
          <Tabs
            onValueChange={(value) => setDays(Number(value) as 7 | 30)}
            value={String(days)}
          >
            <TabsList>
              <TabsTrigger value="7">{t("days7", "7 Days")}</TabsTrigger>
              <TabsTrigger value="30">{t("days30", "30 Days")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 统计卡片 */}
      {trafficStats && <TrafficStatsCards stats={trafficStats} />}

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 流量趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("trafficTrend", "Traffic Trend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Icon className="size-8 animate-spin" icon="uil:spinner" />
              </div>
            ) : trafficStats && trafficStats.list.length > 0 ? (
              <TrafficTrendChart data={trafficStats.list} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                {t("noData", "No traffic data available")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 流量占比图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("trafficRatio", "Upload/Download Ratio")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Icon className="size-8 animate-spin" icon="uil:spinner" />
              </div>
            ) : trafficStats &&
              (getTrafficTotal(trafficStats, "total_upload") > 0 ||
                getTrafficTotal(trafficStats, "total_download") > 0) ? (
              <TrafficRatioChart
                download={getTrafficTotal(trafficStats, "total_download")}
                upload={getTrafficTotal(trafficStats, "total_upload")}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                {t("noData", "No traffic data available")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
