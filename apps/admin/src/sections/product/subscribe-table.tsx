"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import { getNodeGroupList } from "@workspace/ui/services/admin/group";
import {
  batchDeleteSubscribe,
  createSubscribe,
  deleteSubscribe,
  getSubscribeCategoryList,
  getSubscribeList,
  subscribeSort,
  updateSubscribe,
} from "@workspace/ui/services/admin/subscribe";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Display } from "@/components/display";
import { useSubscribe } from "@/stores/subscribe";
import CategoryManager from "./category-manager";
import SubscribeForm from "./subscribe-form";

function buildCategoryOptions(categories: API.SubscribeCategoryInfo[] = []) {
  const childrenMap = new Map<string, API.SubscribeCategoryInfo[]>();
  const roots: API.SubscribeCategoryInfo[] = [];

  for (const category of categories) {
    const parentID = String(category.parent_id || "");
    if (!parentID || parentID === "0") {
      roots.push(category);
      continue;
    }
    const children = childrenMap.get(parentID) || [];
    children.push(category);
    childrenMap.set(parentID, children);
  }

  const options: { label: string; value: string }[] = [];
  const walk = (items: API.SubscribeCategoryInfo[], depth: number) => {
    for (const item of items) {
      options.push({
        label: `${"　".repeat(depth)}${item.name}`,
        value: String(item.id),
      });
      walk(childrenMap.get(String(item.id)) || [], depth + 1);
    }
  };

  walk(roots, 0);
  return options;
}

export default function SubscribeTable() {
  const { i18n, t } = useTranslation("product");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);
  const { fetchSubscribes } = useSubscribe();
  const isZh = i18n.resolvedLanguage?.startsWith("zh");
  const categoryText = useMemo(
    () => ({
      filter: t("category.filter", {
        defaultValue: isZh ? "商品分类" : "Product Category",
      }),
      none: t("category.none", {
        defaultValue: isZh ? "暂无分类" : "Uncategorized",
      }),
      title: t("category.title", {
        defaultValue: isZh ? "商品分类" : "Product Category",
      }),
    }),
    [isZh, t]
  );

  const getNodeGroupSpecialLabel = (nodeGroup?: API.NodeGroup) => {
    switch (nodeGroup?.type) {
      case "subscribe":
        return t("form.nodeGroupSubscribeOnly");
      case "app":
        return t("form.nodeGroupAppOnly");
      default:
        return "";
    }
  };

  const formatNodeGroupOptionLabel = (nodeGroup: API.NodeGroup) => {
    const specialLabel = getNodeGroupSpecialLabel(nodeGroup);
    return specialLabel
      ? `${nodeGroup.name} (${specialLabel})`
      : nodeGroup.name;
  };

  // Fetch node groups for filtering (exclude expired groups)
  const { data: nodeGroupsData } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      const allGroups = data.data?.list || [];
      // Filter out expired node groups
      return allGroups.filter((group) => !group.is_expired_group);
    },
  });

  // Fetch group config to check if group feature is enabled
  const { data: groupConfigData } = useQuery({
    queryKey: ["groupConfig"],
    queryFn: async () => {
      const { data } = await (
        await import("@workspace/ui/services/admin/group")
      ).getGroupConfig();
      return data.data;
    },
  });

  const isGroupEnabled = groupConfigData?.enabled;
  const normalizedNodeGroups = useMemo(
    () =>
      (nodeGroupsData || []).map((group) => ({
        ...group,
        id: String(group.id),
      })),
    [nodeGroupsData]
  );
  const { data: subscribeCategories = [] } = useQuery({
    queryKey: ["subscribeCategories"],
    queryFn: async () => {
      const { data } = await getSubscribeCategoryList({});
      return data.data?.list || [];
    },
  });
  const categoryOptions = useMemo(
    () => [
      { label: t("all", "All"), value: "" },
      ...buildCategoryOptions(subscribeCategories),
    ],
    [subscribeCategories, t]
  );

  return (
    <ProTable<
      API.SubscribeItem,
      {
        group_id: string;
        query: string;
        node_group_id?: string;
        category_id?: string;
      }
    >
      action={ref}
      actions={{
        render: (row) => [
          <SubscribeForm<API.SubscribeItem>
            initialValues={row}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const updateBody: any = {
                  ...row,
                  ...values,
                };
                // Add node_group_ids if it exists in values
                const vals = values as any;
                if (vals.node_group_ids) {
                  updateBody.node_group_ids = vals.node_group_ids;
                }
                await updateSubscribe(updateBody as API.UpdateSubscribeRequest);
                toast.success(t("updateSuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);

                return false;
              }
            }}
            title={t("editSubscribe")}
            trigger={t("edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel")}
            confirmText={t("confirm")}
            description={t("deleteWarning")}
            key="delete"
            onConfirm={async () => {
              await deleteSubscribe({
                id: row.id!,
              });
              toast.success(t("deleteSuccess"));
              ref.current?.refresh();
              fetchSubscribes();
            }}
            title={t("confirmDelete")}
            trigger={<Button variant="destructive">{t("delete")}</Button>}
          />,
          <Button
            key="copy"
            onClick={async () => {
              setLoading(true);
              try {
                const {
                  id: _id,
                  sort: _sort,
                  sell: _sell,
                  updated_at: _updated_at,
                  created_at: _created_at,
                  ...params
                } = row;
                await createSubscribe({
                  ...params,
                  show: false,
                  sell: false,
                } as API.CreateSubscribeRequest);
                toast.success(t("copySuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            variant="secondary"
          >
            {t("copy")}
          </Button>,
        ],
        batchRender: (rows) => [
          <ConfirmButton
            cancelText={t("cancel")}
            confirmText={t("confirm")}
            description={t("deleteWarning")}
            key="delete"
            onConfirm={async () => {
              await batchDeleteSubscribe({
                ids: rows
                  .map((item) => item.id)
                  .filter((id): id is string => Boolean(id)),
              });

              toast.success(t("deleteSuccess"));
              ref.current?.reset();
              fetchSubscribes();
            }}
            title={t("confirmDelete")}
            trigger={<Button variant="destructive">{t("delete")}</Button>}
          />,
        ],
      }}
      columns={[
        {
          accessorKey: "show",
          header: t("show"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("show")}
              onCheckedChange={async (checked) => {
                await updateSubscribe({
                  ...row.original,
                  show: checked,
                } as API.UpdateSubscribeRequest);
                ref.current?.refresh();
                fetchSubscribes();
              }}
            />
          ),
        },
        {
          accessorKey: "sell",
          header: t("sell"),
          cell: ({ row }) => (
            <Switch
              defaultChecked={row.getValue("sell")}
              onCheckedChange={async (checked) => {
                await updateSubscribe({
                  ...row.original,
                  sell: checked,
                } as API.UpdateSubscribeRequest);
                ref.current?.refresh();
                fetchSubscribes();
              }}
            />
          ),
        },
        {
          accessorKey: "name",
          header: t("name"),
        },
        {
          accessorKey: "category_name",
          header: categoryText.title,
          cell: ({ row }) => {
            const categoryName = row.getValue("category_name") as string;
            return categoryName ? (
              <Badge variant="secondary">{categoryName}</Badge>
            ) : (
              <span className="text-muted-foreground">{categoryText.none}</span>
            );
          },
        },
        {
          accessorKey: "unit_price",
          header: t("unitPrice"),
          cell: ({ row }) => {
            const options = row.original.price_options || [];
            const option =
              options.find((item) => item.is_default) || options[0];
            const durationUnit = option?.duration_unit || row.original.unit_time;
            const durationValue =
              durationUnit === "NoLimit" ? 0 : Number(option?.duration_value || 1);
            return (
              <div className="flex flex-col gap-1">
                <span>
                  <Display
                    type="currency"
                    value={option?.price ?? row.getValue("unit_price")}
                  />
                  /{durationUnit === "NoLimit"
                    ? t("form.NoLimit")
                    : `${durationValue} ${t(durationUnit ? `form.${durationUnit}` : "form.Month")}`}
                </span>
                {options.length > 1 && (
                  <Badge variant="outline">
                    {t("form.priceOptionsCount", {
                      count: options.length,
                      defaultValue: "{{count}} options",
                    })}
                  </Badge>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "replacement",
          header: t("replacement"),
          cell: ({ row }) => (
            <Display type="currency" value={row.getValue("replacement")} />
          ),
        },
        {
          accessorKey: "traffic",
          header: t("traffic"),
          cell: ({ row }) => (
            <Display type="traffic" unlimited value={row.getValue("traffic")} />
          ),
        },
        {
          accessorKey: "device_limit",
          header: t("deviceLimit"),
          cell: ({ row }) => (
            <Display
              type="number"
              unlimited
              value={row.getValue("device_limit")}
            />
          ),
        },
        {
          accessorKey: "inventory",
          header: t("inventory"),
          cell: ({ row }) => {
            const inventory = row.getValue("inventory") as number;
            return (
              <Display
                type="number"
                unlimited={inventory === -1}
                value={inventory === -1 ? 0 : inventory}
              />
            );
          },
        },
        {
          accessorKey: "quota",
          header: t("quota"),
          cell: ({ row }) => (
            <Display type="number" unlimited value={row.getValue("quota")} />
          ),
        },
        {
          accessorKey: "language",
          header: t("language"),
          cell: ({ row }) => {
            const language = row.getValue("language") as string;
            return language ? (
              <Badge variant="outline">{language}</Badge>
            ) : (
              "--"
            );
          },
        },
        {
          accessorKey: "sold",
          header: t("sold"),
          cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("sold")}</Badge>
          ),
        },
        ...(isGroupEnabled
          ? [
              {
                id: "node_group",
                header: t("defaultNodeGroup", "Default Node Group"),
                cell: ({ row }: { row: any }) => {
                  const nodeGroupId = row.original.node_group_id;
                  const nodeGroup = normalizedNodeGroups.find(
                    (g) => String(g.id) === String(nodeGroupId)
                  );
                  const specialLabel = getNodeGroupSpecialLabel(nodeGroup);

                  return (
                    <div className="flex flex-wrap items-center gap-2">
                      {nodeGroup ? (
                        <>
                          <Badge variant="outline">{nodeGroup.name}</Badge>
                          {specialLabel && (
                            <Badge variant="secondary">{specialLabel}</Badge>
                          )}
                        </>
                      ) : null}
                    </div>
                  );
                },
              },
            ]
          : []),
      ]}
      header={{
        toolbar: [
          <CategoryManager
            key="category"
            onChanged={() => {
              ref.current?.refresh();
            }}
          />,
          <SubscribeForm<API.CreateSubscribeRequest>
            key="create"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const createBody: any = {
                  ...values,
                  show: false,
                  sell: false,
                };
                // Add node_group_ids if it exists in values
                const vals = values as any;
                if (vals.node_group_ids) {
                  createBody.node_group_ids = vals.node_group_ids;
                }
                await createSubscribe(createBody);
                toast.success(t("createSuccess"));
                ref.current?.refresh();
                fetchSubscribes();
                setLoading(false);

                return true;
              } catch {
                setLoading(false);

                return false;
              }
            }}
            title={t("createSubscribe")}
            trigger={t("create")}
          />,
        ],
      }}
      onSort={async (source, target, items) => {
        const sourceIndex = items.findIndex(
          (item) => String(item.id) === source
        );
        const targetIndex = items.findIndex(
          (item) => String(item.id) === target
        );

        const originalSorts = items.map((item) => item.sort);

        const [movedItem] = items.splice(sourceIndex, 1);
        items.splice(targetIndex, 0, movedItem!);

        const updatedItems = items.map((item, index) => {
          const originalSort = originalSorts[index];
          const newSort = originalSort !== undefined ? originalSort : item.sort;
          return { ...item, sort: newSort };
        });

        const changedItems = updatedItems.filter(
          (item, index) => item.sort !== items[index]?.sort
        );

        if (changedItems.length > 0) {
          await subscribeSort({
            sort: changedItems.map((item) => ({
              id: item.id,
              sort: item.sort,
            })) as API.SortItem[],
          });
          toast.success(t("sortSuccess", "Sort completed successfully"));
        }

        return updatedItems;
      }}
      params={[
        {
          key: "search",
        },
        ...(isGroupEnabled
          ? [
              {
                key: "node_group_id",
                placeholder: t("nodeGroups", "Node Groups"),
                options: [
                  { label: t("all", "All"), value: "" },
                  ...(normalizedNodeGroups.map((item) => ({
                    label: formatNodeGroupOptionLabel(item),
                    value: String(item.id),
                  })) || []),
                ],
              },
            ]
          : []),
        {
          key: "category_id",
          placeholder: categoryText.filter,
          options: categoryOptions,
        },
      ]}
      request={async (pagination, filters) => {
        const params = {
          ...pagination,
          ...filters,
          node_group_id: filters?.node_group_id || undefined,
          category_id: filters?.category_id || undefined,
        } as any;

        const { data } = await getSubscribeList(params);
        return {
          list: data.data?.list || [],
          total: data.data?.total || 0,
        };
      }}
    />
  );
}
