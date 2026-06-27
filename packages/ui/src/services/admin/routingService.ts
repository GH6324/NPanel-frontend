// @ts-ignore
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** 此处后端没有提供注释 PUT /v1/admin/routing/dns_resolver */
export async function routingServiceUpdateDnsResolver(
  body: API.UpdateDnsResolverRequest,
  options?: { [key: string]: any }
) {
  return request<API.DnsResolverReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/dns_resolver`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/dns_resolver */
export async function routingServiceCreateDnsResolver(
  body: API.CreateDnsResolverRequest,
  options?: { [key: string]: any }
) {
  return request<API.DnsResolverReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/dns_resolver`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/dns_resolver */
export async function routingServiceDeleteDnsResolver(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceDeleteDnsResolverParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/dns_resolver`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/dns_resolvers */
export async function routingServiceListDnsResolvers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceListDnsResolversParams,
  options?: { [key: string]: any }
) {
  return request<API.ListDnsResolversReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/dns_resolvers`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /v1/admin/routing/outbound */
export async function routingServiceUpdateRouteOutbound(
  body: API.UpdateRouteOutboundRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteOutboundReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/outbound`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/outbound */
export async function routingServiceCreateRouteOutbound(
  body: API.CreateRouteOutboundRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteOutboundReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/outbound`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/outbound */
export async function routingServiceDeleteRouteOutbound(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceDeleteRouteOutboundParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/outbound`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/outbounds */
export async function routingServiceListRouteOutbounds(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceListRouteOutboundsParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRouteOutboundsReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/outbounds`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/preview */
export async function routingServicePreviewRouteConfig(
  body: API.PreviewRouteConfigRequest,
  options?: { [key: string]: any }
) {
  return request<API.PreviewRouteConfigReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/preview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/overview */
export async function routingServiceGetRoutingOverview(options?: {
  [key: string]: any;
}) {
  return request<API.GetRoutingOverviewReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/overview`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/health_reports */
export async function routingServiceListRoutingHealthReports(
  params: API.RoutingServiceListRoutingHealthReportsParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRoutingHealthReportsReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/health_reports`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/route_events */
export async function routingServiceListRoutingRouteEvents(
  params: API.RoutingServiceListRoutingRouteEventsParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRoutingRouteEventsReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/route_events`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/analytics */
export async function routingServiceGetRoutingAnalytics(
  params: API.RoutingServiceGetRoutingAnalyticsParams,
  options?: { [key: string]: any }
) {
  return request<API.GetRoutingAnalyticsReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/analytics`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/gray_releases */
export async function routingServiceListRoutingGrayReleases(
  params: API.RoutingServiceListRoutingGrayReleasesParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRoutingGrayReleasesReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/gray_releases`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/gray_release */
export async function routingServiceCreateRoutingGrayRelease(
  body: API.CreateRoutingGrayReleaseRequest,
  options?: { [key: string]: any }
) {
  return request<API.RoutingGrayReleaseReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/gray_release`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /v1/admin/routing/gray_release */
export async function routingServiceUpdateRoutingGrayRelease(
  body: API.UpdateRoutingGrayReleaseRequest,
  options?: { [key: string]: any }
) {
  return request<API.RoutingGrayReleaseReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/gray_release`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/gray_release */
export async function routingServiceDeleteRoutingGrayRelease(
  params: API.RoutingServiceDeleteRoutingGrayReleaseParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/gray_release`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/gray_release/action */
export async function routingServiceActRoutingGrayRelease(
  body: API.ActRoutingGrayReleaseRequest,
  options?: { [key: string]: any }
) {
  return request<API.RoutingGrayReleaseReply>(
    `${
      import.meta.env.VITE_API_PREFIX || ""
    }/v1/admin/routing/gray_release/action`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /v1/admin/routing/profile */
export async function routingServiceUpdateRouteProfile(
  body: API.UpdateRouteProfileRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteProfileReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/profile */
export async function routingServiceCreateRouteProfile(
  body: API.CreateRouteProfileRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteProfileReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/profile */
export async function routingServiceDeleteRouteProfile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceDeleteRouteProfileParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/profile`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/profiles */
export async function routingServiceListRouteProfiles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceListRouteProfilesParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRouteProfilesReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/profiles`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /v1/admin/routing/rule */
export async function routingServiceUpdateRouteRule(
  body: API.UpdateRouteRuleRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteRuleReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/rule`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/rule */
export async function routingServiceCreateRouteRule(
  body: API.CreateRouteRuleRequest,
  options?: { [key: string]: any }
) {
  return request<API.RouteRuleReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/rule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/rule */
export async function routingServiceDeleteRouteRule(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceDeleteRouteRuleParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/rule`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/rules */
export async function routingServiceListRouteRules(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceListRouteRulesParams,
  options?: { [key: string]: any }
) {
  return request<API.ListRouteRulesReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/rules`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 PUT /v1/admin/routing/unlock_service */
export async function routingServiceUpdateUnlockService(
  body: API.UpdateUnlockServiceRequest,
  options?: { [key: string]: any }
) {
  return request<API.UnlockServiceReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/unlock_service`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/admin/routing/unlock_service */
export async function routingServiceCreateUnlockService(
  body: API.CreateUnlockServiceRequest,
  options?: { [key: string]: any }
) {
  return request<API.UnlockServiceReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/unlock_service`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 DELETE /v1/admin/routing/unlock_service */
export async function routingServiceDeleteUnlockService(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceDeleteUnlockServiceParams,
  options?: { [key: string]: any }
) {
  return request<API.DeleteRouteItemReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/unlock_service`,
    {
      method: "DELETE",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 GET /v1/admin/routing/unlock_services */
export async function routingServiceListUnlockServices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.RoutingServiceListUnlockServicesParams,
  options?: { [key: string]: any }
) {
  return request<API.ListUnlockServicesReply>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/routing/unlock_services`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
