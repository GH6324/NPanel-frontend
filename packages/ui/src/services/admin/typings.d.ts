declare namespace API {
  type ActionReply = {
    code?: number;
    msg?: string;
  };

  type Ads = {
    id?: string;
    title?: string;
    type?: string;
    content?: string;
    description?: string;
    targetUrl?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type Ads = {
    id?: string;
    title?: string;
    type?: string;
    content?: string;
    description?: string;
    targetUrl?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type AdsServiceDeleteAdsParams = {
    id?: string;
  };

  type AdsServiceGetAdsListParams = {
    page?: number;
    size?: number;
    search?: string;
    status?: number;
  };

  type AdsServiceGetAdsParams = {
    id?: string;
  };

  type AlipayNotifyReply = {
    response?: string;
  };

  type Announcement = {
    id?: string;
    title?: string;
    content?: string;
    show?: boolean;
    pinned?: boolean;
    popup?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type AnnouncementData = {
    announcement?: Announcement;
  };

  type AnnouncementItem = {
    id?: string;
    title?: string;
    content?: string;
    show?: boolean;
    pinned?: boolean;
    popup?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type AnnouncementReply = {
    code?: number;
    message?: string;
    data?: AnnouncementData;
  };

  type AnnouncementServiceDeleteAnnouncementParams = {
    id?: string;
  };

  type AnnouncementServiceGetAnnouncementParams = {
    id?: string;
  };

  type AnnouncementServiceListAnnouncementsParams = {
    page?: string;
    size?: string;
    search?: string;
    show?: boolean;
    pinned?: boolean;
    popup?: boolean;
  };

  type AppleLoginCallbackRequest = {
    code?: string;
    idToken?: string;
    state?: string;
  };

  type AuthConfig = {
    mobile?: MobileAuthConfig;
    email?: EmailAuthConfig;
    device?: DeviceAuthConfig;
    register?: RegisterConfig;
  };

  type AuthMethodConfig = {
    id?: string;
    method?: string;
    config?: Record<string, any>;
    enabled?: boolean;
  };

  type AuthMethodConfigData = {
    config?: AuthMethodConfig;
  };

  type AuthMethodConfigReply = {
    code?: number;
    message?: string;
    data?: AuthMethodConfigData;
  };

  type AuthMethodListData = {
    list?: AuthMethodConfig[];
  };

  type AuthMethodListReply = {
    code?: number;
    message?: string;
    data?: AuthMethodListData;
  };

  type AuthMethodServiceGetAuthMethodConfigParams = {
    method?: string;
  };

  type BalanceLog = {
    type?: number;
    userId?: string;
    amount?: string;
    orderNo?: string;
    balance?: string;
    timestamp?: string;
  };

  type BalanceLog = {
    type?: number;
    userId?: string;
    amount?: string;
    orderNo?: string;
    balance?: string;
    timestamp?: string;
  };

  type BatchDeleteCouponReply = {
    code?: number;
    message?: string;
  };

  type BatchDeleteCouponRequest = {
    ids?: string[];
  };

  type BatchDeleteDocumentData = {
    success?: boolean;
  };

  type BatchDeleteDocumentReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteDocumentData;
  };

  type BatchDeleteRedemptionCodeData = {
    success?: boolean;
  };

  type BatchDeleteRedemptionCodeReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteRedemptionCodeData;
  };

  type BatchDeleteRedemptionCodeRequest = {
    ids?: string[];
  };

  type BatchDeleteSubscribeCategoryData = {
    success?: boolean;
  };

  type BatchDeleteSubscribeCategoryReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteSubscribeCategoryData;
  };

  type BatchDeleteSubscribeCategoryRequest = {
    ids?: string[];
  };

  type BatchDeleteSubscribeData = {
    success?: boolean;
  };

  type BatchDeleteSubscribeGroupData = {
    success?: boolean;
  };

  type BatchDeleteSubscribeGroupReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteSubscribeGroupData;
  };

  type BatchDeleteSubscribeGroupRequest = {
    ids?: string[];
  };

  type BatchDeleteSubscribeReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteSubscribeData;
  };

  type BatchDeleteSubscribeRequest = {
    ids?: string[];
  };

  type BatchDeleteUserData = {
    deletedCount?: string;
  };

  type BatchDeleteUserReply = {
    code?: number;
    message?: string;
    data?: BatchDeleteUserData;
  };

  type BatchSendEmailTask = {
    id?: string;
    subject?: string;
    content?: string;
    recipients?: string;
    scope?: number;
    registerStartTime?: string;
    registerEndTime?: string;
    additional?: string;
    scheduled?: string;
    interval?: number;
    limit?: string;
    status?: number;
    errors?: string;
    total?: number;
    current?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type BindOAuthCallbackRequest = {
    method?: string;
    callback?: Value;
  };

  type BindOAuthReply = {
    redirect?: string;
  };

  type BindOAuthRequest = {
    method?: string;
    redirect?: string;
  };

  type BindTelegramReply = {
    url?: string;
    expiredAt?: string;
  };

  type CallbackReply = {
    code?: number;
    message?: string;
  };

  type CheckUserReply = {
    exist?: boolean;
  };

  type CheckUserReply = {
    exist?: boolean;
  };

  type CheckUserTelephoneReply = {
    exist?: boolean;
  };

  type CheckUserTelephoneReply = {
    exist?: boolean;
  };

  type CheckVerificationCodeReply = {
    status?: boolean;
  };

  type CheckVerificationCodeRequest = {
    method?: string;
    account?: string;
    code?: string;
    type?: number;
  };

  type CloseOrderRequest = {
    orderNo?: string;
  };

  type CommissionLog = {
    type?: number;
    userId?: string;
    amount?: string;
    orderNo?: string;
    timestamp?: string;
  };

  type CommissionLog = {
    type?: number;
    userId?: string;
    amount?: string;
    orderNo?: string;
    timestamp?: string;
  };

  type CommissionWithdrawRequest = {
    amount?: string;
    content?: string;
  };

  type ConnectionRecords = {
    currentContinuousDays?: string;
    historyContinuousDays?: string;
    longestSingleConnection?: string;
  };

  type CouponItem = {
    id?: string;
    name?: string;
    code?: string;
    count?: string;
    type?: number;
    discount?: string;
    startTime?: string;
    expireTime?: string;
    userLimit?: string;
    subscribe?: string[];
    usedCount?: string;
    enable?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type CouponServiceDeleteCouponParams = {
    id?: string;
  };

  type CouponServiceGetCouponListParams = {
    page?: string;
    size?: string;
    subscribe?: string;
    search?: string;
  };

  type CreateAdsData = {
    ads?: Ads;
  };

  type CreateAdsReply = {
    code?: number;
    message?: string;
    data?: CreateAdsData;
  };

  type CreateAdsRequest = {
    title?: string;
    type?: string;
    content?: string;
    description?: string;
    targetUrl?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
  };

  type CreateAnnouncementRequest = {
    title?: string;
    content?: string;
  };

  type CreateBatchSendEmailTaskData = {
    success?: boolean;
  };

  type CreateBatchSendEmailTaskReply = {
    code?: number;
    message?: string;
    data?: CreateBatchSendEmailTaskData;
  };

  type CreateBatchSendEmailTaskRequest = {
    subject?: string;
    content?: string;
    scope?: number;
    registerStartTime?: string;
    registerEndTime?: string;
    additional?: string;
    scheduled?: string;
    interval?: number;
    limit?: string;
  };

  type CreateCouponReply = {
    code?: number;
    message?: string;
  };

  type CreateCouponRequest = {
    name?: string;
    code?: string;
    count?: string;
    type?: number;
    discount?: string;
    startTime?: string;
    expireTime?: string;
    userLimit?: string;
    subscribe?: string[];
    usedCount?: string;
    enable?: boolean;
  };

  type CreateDnsResolverRequest = {
    resolver?: DnsResolver;
  };

  type CreateDocumentReply = {
    code?: number;
    message?: string;
  };

  type CreateDocumentRequest = {
    title?: string;
    content?: string;
    tags?: string[];
    show?: boolean;
  };

  type CreateNodeData = {
    node?: Node;
  };

  type CreateNodeGroupData = {
    id?: string;
  };

  type CreateNodeGroupReply = {
    code?: number;
    message?: string;
    data?: CreateNodeGroupData;
  };

  type CreateNodeGroupRequest = {
    name?: string;
    type?: string;
    description?: string;
    sort?: number;
    forCalculation?: boolean;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: number;
    maxTrafficGbExpired?: string;
    speedLimit?: number;
    minTrafficGb?: string;
    maxTrafficGb?: string;
  };

  type CreateNodeReply = {
    code?: number;
    message?: string;
    data?: CreateNodeData;
  };

  type CreateNodeRequest = {
    name?: string;
    tags?: string[];
    port?: number;
    address?: string;
    serverId?: string;
    protocol?: string;
    enabled?: boolean;
    nodeType?: string;
    isHidden?: boolean;
    nodeGroupIds?: string[];
  };

  type CreateOrderReply = {
    code?: number;
    message?: string;
  };

  type CreateOrderRequest = {
    userId?: string;
    type?: number;
    quantity?: string;
    price?: string;
    amount?: string;
    discount?: string;
    coupon?: string;
    couponDiscount?: string;
    commission?: string;
    feeAmount?: string;
    paymentId?: string;
    tradeNo?: string;
    status?: number;
    subscribeId?: string;
  };

  type CreatePaymentMethodReply = {
    code?: number;
    message?: string;
    data?: PaymentConfig;
  };

  type CreatePaymentMethodRequest = {
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    domain?: string;
    config?: Record<string, any>;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
    sort?: number;
    enable?: boolean;
  };

  type CreateQuotaTaskData = {
    success?: boolean;
  };

  type CreateQuotaTaskReply = {
    code?: number;
    message?: string;
    data?: CreateQuotaTaskData;
  };

  type CreateQuotaTaskRequest = {
    subscribers?: string[];
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
    resetTraffic?: boolean;
    days?: string;
    giftType?: number;
    giftValue?: string;
  };

  type CreateRedemptionCodeData = {
    createdCount?: string;
  };

  type CreateRedemptionCodeReply = {
    code?: number;
    message?: string;
    data?: CreateRedemptionCodeData;
  };

  type CreateRedemptionCodeRequest = {
    totalCount?: string;
    subscribePlan?: string;
    unitTime?: string;
    quantity?: number;
    batchCount?: string;
  };

  type CreateRouteOutboundRequest = {
    outbound?: RouteOutbound;
  };

  type CreateRouteProfileRequest = {
    profile?: RouteProfile;
  };

  type CreateRouteRuleRequest = {
    rule?: RouteRule;
  };

  type CreateServerData = {
    server?: Server;
  };

  type CreateServerReply = {
    code?: number;
    message?: string;
    data?: CreateServerData;
  };

  type CreateServerRequest = {
    name?: string;
    country?: string;
    city?: string;
    address?: string;
    sort?: number;
    protocols?: Protocol[];
  };

  type CreateSubscribeApplicationRequest = {
    name?: string;
    icon?: string;
    description?: string;
    scheme?: string;
    userAgent?: string;
    isDefault?: boolean;
    template?: string;
    outputFormat?: string;
    downloadLink?: DownloadLink;
  };

  type CreateSubscribeCategoryData = {
    success?: boolean;
  };

  type CreateSubscribeCategoryReply = {
    code?: number;
    message?: string;
    data?: CreateSubscribeCategoryData;
  };

  type CreateSubscribeCategoryRequest = {
    parentId?: string | number;
    parent_id?: string | number;
    name?: string;
    description?: string;
    language?: string;
    show?: boolean;
    sort?: number;
  };

  type CreateSubscribeData = {
    success?: boolean;
  };

  type CreateSubscribeGroupData = {
    success?: boolean;
  };

  type CreateSubscribeGroupReply = {
    code?: number;
    message?: string;
    data?: CreateSubscribeGroupData;
  };

  type CreateSubscribeGroupRequest = {
    name?: string;
    description?: string;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: string;
    maxTrafficGbExpired?: string;
    speedLimit?: number;
  };

  type CreateSubscribeReply = {
    code?: number;
    message?: string;
    data?: CreateSubscribeData;
  };

  type CreateSubscribeRequest = {
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    autoCreateGroup?: boolean;
    priceOptions?: SubscribePriceOption[];
  };

  type CreateTicketFollowReply = {
    code?: number;
    message?: string;
  };

  type CreateTicketFollowRequest = {
    ticketId?: string;
    from?: string;
    type?: number;
    content?: string;
  };

  type CreateUnlockServiceRequest = {
    service?: UnlockService;
  };

  type CreateUserAuthMethodData = {
    success?: boolean;
  };

  type CreateUserAuthMethodReply = {
    code?: number;
    message?: string;
    data?: CreateUserAuthMethodData;
  };

  type CreateUserAuthMethodRequest = {
    userId?: string;
    authType?: string;
    authIdentifier?: string;
  };

  type CreateUserData = {
    userId?: string;
  };

  type CreateUserReply = {
    code?: number;
    message?: string;
    data?: CreateUserData;
  };

  type CreateUserRequest = {
    email?: string;
    telephone?: string;
    telephoneAreaCode?: string;
    password?: string;
    productId?: string;
    duration?: string;
    referralPercentage?: number;
    onlyFirstPurchase?: boolean;
    refererUser?: string;
    referCode?: string;
    balance?: string;
    commission?: string;
    giftAmount?: string;
    isAdmin?: boolean;
  };

  type CreateUserSubscribeReply = {
    code?: number;
    message?: string;
  };

  type CreateUserSubscribeRequest = {
    userId?: string;
    expiredAt?: string;
    traffic?: string;
    subscribeId?: string;
  };

  type CreateUserTicketFollowRequest = {
    ticketId?: string;
    from?: string;
    type?: number;
    content?: string;
  };

  type CreateUserTicketRequest = {
    title?: string;
    description?: string;
  };

  type CurrencyConfig = {
    accessKey?: string;
    currencyUnit?: string;
    currencySymbol?: string;
  };

  type CurrencyConfig = {
    currencyUnit?: string;
    currencySymbol?: string;
  };

  type CurrentUserData = {
    user?: User;
  };

  type CurrentUserReply = {
    code?: number;
    message?: string;
    data?: CurrentUserData;
  };

  type DailyTrafficStats = {
    date?: string;
    upload?: string;
    download?: string;
    total?: number;
  };

  type DeleteAdsData = {
    success?: boolean;
  };

  type DeleteAdsReply = {
    code?: number;
    message?: string;
    data?: DeleteAdsData;
  };

  type DeleteAnnouncementData = {
    success?: boolean;
  };

  type DeleteAnnouncementReply = {
    code?: number;
    message?: string;
    data?: DeleteAnnouncementData;
  };

  type DeleteCouponReply = {
    code?: number;
    message?: string;
  };

  type DeleteDocumentData = {
    success?: boolean;
  };

  type DeleteDocumentReply = {
    code?: number;
    message?: string;
    data?: DeleteDocumentData;
  };

  type DeleteNodeData = {
    success?: boolean;
  };

  type DeleteNodeGroupData = {
    success?: boolean;
  };

  type DeleteNodeGroupReply = {
    code?: number;
    message?: string;
    data?: DeleteNodeGroupData;
  };

  type DeleteNodeGroupRequest = {
    id?: string;
  };

  type DeleteNodeReply = {
    code?: number;
    message?: string;
    data?: DeleteNodeData;
  };

  type DeleteNodeRequest = {
    id?: string;
  };

  type DeletePaymentMethodReply = {
    code?: number;
    message?: string;
  };

  type DeleteRedemptionCodeData = {
    success?: boolean;
  };

  type DeleteRedemptionCodeReply = {
    code?: number;
    message?: string;
    data?: DeleteRedemptionCodeData;
  };

  type DeleteRedemptionCodeRequest = {
    id?: string;
  };

  type DeleteRouteItemData = {
    success?: boolean;
  };

  type DeleteRouteItemReply = {
    code?: number;
    message?: string;
    data?: DeleteRouteItemData;
  };

  type DeleteServerData = {
    success?: boolean;
  };

  type DeleteServerReply = {
    code?: number;
    message?: string;
    data?: DeleteServerData;
  };

  type DeleteServerRequest = {
    id?: string;
  };

  type DeleteSubscribeApplicationData = {
    success?: boolean;
  };

  type DeleteSubscribeApplicationReply = {
    code?: number;
    message?: string;
    data?: DeleteSubscribeApplicationData;
  };

  type DeleteSubscribeApplicationRequest = {
    id?: string;
  };

  type DeleteSubscribeCategoryData = {
    success?: boolean;
  };

  type DeleteSubscribeCategoryReply = {
    code?: number;
    message?: string;
    data?: DeleteSubscribeCategoryData;
  };

  type DeleteSubscribeCategoryRequest = {
    id?: string;
  };

  type DeleteSubscribeData = {
    success?: boolean;
  };

  type DeleteSubscribeGroupData = {
    success?: boolean;
  };

  type DeleteSubscribeGroupReply = {
    code?: number;
    message?: string;
    data?: DeleteSubscribeGroupData;
  };

  type DeleteSubscribeGroupRequest = {
    id?: string;
  };

  type DeleteSubscribeReply = {
    code?: number;
    message?: string;
    data?: DeleteSubscribeData;
  };

  type DeleteSubscribeRequest = {
    id?: string;
  };

  type DeleteUserAuthMethodData = {
    success?: boolean;
  };

  type DeleteUserAuthMethodReply = {
    code?: number;
    message?: string;
    data?: DeleteUserAuthMethodData;
  };

  type DeleteUserData = {
    success?: boolean;
  };

  type DeleteUserDeviceData = {
    success?: boolean;
  };

  type DeleteUserDeviceReply = {
    code?: number;
    message?: string;
    data?: DeleteUserDeviceData;
  };

  type DeleteUserReply = {
    code?: number;
    message?: string;
    data?: DeleteUserData;
  };

  type DeleteUserSubscribeReply = {
    code?: number;
    message?: string;
  };

  type DeviceAuthConfig = {
    enable?: boolean;
    showAds?: boolean;
    enableSecurity?: boolean;
    onlyRealDevice?: boolean;
  };

  type DeviceLoginRequest = {
    identifier?: string;
    ip?: string;
    userAgent?: string;
    cfToken?: string;
    shortCode?: string;
  };

  type DnsResolver = {
    id?: string;
    tag?: string;
    name?: string;
    proto?: string;
    address?: string;
    port?: number;
    enabled?: boolean;
    resolverJson?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type DnsResolverData = {
    resolver?: DnsResolver;
  };

  type DnsResolverListData = {
    list?: DnsResolver[];
    total?: number;
  };

  type DnsResolverReply = {
    code?: number;
    message?: string;
    data?: DnsResolverData;
  };

  type Document = {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    show?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type Document = {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    show?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type DocumentDetailReply = {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    show?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type DocumentListReply = {
    total?: number;
    list?: Document[];
  };

  type DocumentServiceBatchDeleteDocumentParams = {
    ids?: string[];
  };

  type DocumentServiceDeleteDocumentParams = {
    id?: string;
  };

  type DocumentServiceGetDocumentDetailParams = {
    id?: string;
  };

  type DocumentServiceGetDocumentListParams = {
    page?: string;
    size?: string;
    tag?: string;
    search?: string;
  };

  type DownloadLink = {
    windows?: string;
    macos?: string;
    linux?: string;
    android?: string;
    ios?: string;
  };

  type DownloadLink = {
    ios?: string;
    android?: string;
    windows?: string;
    mac?: string;
    linux?: string;
    harmony?: string;
  };

  type EmailAuthConfig = {
    enable?: boolean;
    enableVerify?: boolean;
    enableDomainSuffix?: boolean;
    domainSuffixList?: string;
  };

  type EmailLog = {
    id?: string;
    type?: number;
    platform?: string;
    to?: string;
    subject?: string;
    content?: string;
    status?: number;
    createdAt?: string;
  };

  type EPayNotifyReply = {
    response?: string;
  };

  type ExportGroupResultData = {
    fileUrl?: string;
  };

  type ExportGroupResultReply = {
    code?: number;
    message?: string;
    data?: ExportGroupResultData;
  };

  type FilterBalanceLogData = {
    total?: number;
    list?: BalanceLog[];
  };

  type FilterBalanceLogReply = {
    code?: number;
    message?: string;
    data?: FilterBalanceLogData;
  };

  type FilterCommissionLogData = {
    total?: number;
    list?: CommissionLog[];
  };

  type FilterCommissionLogReply = {
    code?: number;
    message?: string;
    data?: FilterCommissionLogData;
  };

  type FilterEmailLogData = {
    total?: number;
    list?: EmailLog[];
  };

  type FilterEmailLogReply = {
    code?: number;
    message?: string;
    data?: FilterEmailLogData;
  };

  type FilterGiftLogData = {
    total?: number;
    list?: GiftLog[];
  };

  type FilterGiftLogReply = {
    code?: number;
    message?: string;
    data?: FilterGiftLogData;
  };

  type FilterLoginLogData = {
    total?: number;
    list?: LoginLog[];
  };

  type FilterLoginLogReply = {
    code?: number;
    message?: string;
    data?: FilterLoginLogData;
  };

  type FilterMobileLogData = {
    total?: number;
    list?: MobileLog[];
  };

  type FilterMobileLogReply = {
    code?: number;
    message?: string;
    data?: FilterMobileLogData;
  };

  type FilterNodeListData = {
    total?: number;
    list?: Node[];
  };

  type FilterNodeListReply = {
    code?: number;
    message?: string;
    data?: FilterNodeListData;
  };

  type FilterRegisterLogData = {
    total?: number;
    list?: RegisterLog[];
  };

  type FilterRegisterLogReply = {
    code?: number;
    message?: string;
    data?: FilterRegisterLogData;
  };

  type FilterResetSubscribeLogData = {
    total?: number;
    list?: ResetSubscribeLog[];
  };

  type FilterResetSubscribeLogReply = {
    code?: number;
    message?: string;
    data?: FilterResetSubscribeLogData;
  };

  type FilterServerListData = {
    total?: number;
    list?: Server[];
  };

  type FilterServerListReply = {
    code?: number;
    message?: string;
    data?: FilterServerListData;
  };

  type FilterServerTrafficLogData = {
    total?: number;
    list?: ServerTrafficLog[];
  };

  type FilterServerTrafficLogReply = {
    code?: number;
    message?: string;
    data?: FilterServerTrafficLogData;
  };

  type FilterSubscribeLogData = {
    total?: number;
    list?: SubscribeLog[];
  };

  type FilterSubscribeLogReply = {
    code?: number;
    message?: string;
    data?: FilterSubscribeLogData;
  };

  type FilterTrafficLogDetailsData = {
    total?: number;
    list?: TrafficLogDetail[];
  };

  type FilterTrafficLogDetailsReply = {
    code?: number;
    message?: string;
    data?: FilterTrafficLogDetailsData;
  };

  type FilterUserSubscribeTrafficLogData = {
    total?: number;
    list?: UserSubscribeTrafficLog[];
  };

  type FilterUserSubscribeTrafficLogReply = {
    code?: number;
    message?: string;
    data?: FilterUserSubscribeTrafficLogData;
  };

  type GenerateCaptchaReply = {
    type?: string;
    id?: string;
    image?: string;
    blockImage?: string;
  };

  type GetAdsData = {
    ads?: Ads;
  };

  type GetAdsListData = {
    total?: number;
    list?: Ads[];
  };

  type GetAdsListReply = {
    code?: number;
    message?: string;
    data?: GetAdsListData;
  };

  type GetAdsReply = {
    code?: number;
    message?: string;
    data?: GetAdsData;
  };

  type GetAdsReply = {
    list?: Ads[];
  };

  type GetAvailablePaymentMethodsReply = {
    methods?: PaymentMethod[];
  };

  type GetBatchSendEmailTaskListData = {
    total?: number;
    list?: BatchSendEmailTask[];
  };

  type GetBatchSendEmailTaskListReply = {
    code?: number;
    message?: string;
    data?: GetBatchSendEmailTaskListData;
  };

  type GetBatchSendEmailTaskStatusData = {
    status?: number;
    current?: number;
    total?: number;
    errors?: string;
  };

  type GetBatchSendEmailTaskStatusReply = {
    code?: number;
    message?: string;
    data?: GetBatchSendEmailTaskStatusData;
  };

  type GetBatchSendEmailTaskStatusRequest = {
    id?: string;
  };

  type GetClientReply = {
    total?: number;
    list?: SubscribeClient[];
  };

  type GetCouponListData = {
    list?: CouponItem[];
    total?: number;
  };

  type GetCouponListReply = {
    code?: number;
    message?: string;
    data?: GetCouponListData;
  };

  type GetCurrencyConfigReply = {
    code?: number;
    message?: string;
    data?: CurrencyConfig;
  };

  type GetDeviceListReply = {
    list?: UserDevice[];
    total?: number;
  };

  type GetDeviceOnlineStatisticsReply = {
    weeklyStats?: WeeklyStat[];
    connectionRecords?: ConnectionRecords;
  };

  type GetDocumentDetailData = {
    document?: Document;
  };

  type GetDocumentDetailReply = {
    code?: number;
    message?: string;
    data?: GetDocumentDetailData;
  };

  type GetDocumentListData = {
    total?: number;
    list?: Document[];
  };

  type GetDocumentListReply = {
    code?: number;
    message?: string;
    data?: GetDocumentListData;
  };

  type GetGlobalConfigReply = {
    site?: SiteConfig;
    verify?: VerifyConfig;
    auth?: AuthConfig;
    invite?: InviteConfig;
    currency?: CurrencyConfig;
    subscribe?: SubscribeConfig;
    verifyCode?: PublicVerifyCodeConfig;
    oauthMethods?: string[];
    webAd?: boolean;
  };

  type GetGroupConfigData = {
    enabled?: boolean;
    mode?: string;
    config?: string;
    state?: RecalculationState;
  };

  type GetGroupConfigReply = {
    code?: number;
    message?: string;
    data?: GetGroupConfigData;
  };

  type GetGroupHistoryData = {
    total?: number;
    list?: GroupHistory[];
  };

  type GetGroupHistoryDetailReply = {
    code?: number;
    message?: string;
    data?: GroupHistoryDetail;
  };

  type GetGroupHistoryReply = {
    code?: number;
    message?: string;
    data?: GetGroupHistoryData;
  };

  type GetInviteConfigReply = {
    code?: number;
    message?: string;
    data?: InviteConfig;
  };

  type GetLoginLogReply = {
    list?: UserLoginLog[];
    total?: number;
  };

  type GetLogSettingReply = {
    code?: number;
    message?: string;
    data?: LogSetting;
  };

  type GetMessageLogListData = {
    total?: number;
    list?: MessageLog[];
  };

  type GetMessageLogListReply = {
    code?: number;
    message?: string;
    data?: GetMessageLogListData;
  };

  type GetNodeConfigReply = {
    code?: number;
    message?: string;
    data?: NodeConfig;
  };

  type GetNodeGroupListData = {
    total?: number;
    list?: NodeGroup[];
  };

  type GetNodeGroupListReply = {
    code?: number;
    message?: string;
    data?: GetNodeGroupListData;
  };

  type GetNodeMultiplierData = {
    periods?: TimePeriod[];
  };

  type GetNodeMultiplierReply = {
    code?: number;
    message?: string;
    data?: GetNodeMultiplierData;
  };

  type GetOAuthMethodsReply = {
    methods?: UserAuthMethod[];
  };

  type GetOrderListData = {
    total?: number;
    list?: OrderItem[];
  };

  type GetOrderListReply = {
    code?: number;
    message?: string;
    data?: GetOrderListData;
  };

  type GetPaymentMethodListData = {
    total?: number;
    list?: PaymentMethodDetail[];
  };

  type GetPaymentMethodListReply = {
    code?: number;
    message?: string;
    data?: GetPaymentMethodListData;
  };

  type GetPaymentPlatformData = {
    list?: PaymentPlatform[];
  };

  type GetPaymentPlatformReply = {
    code?: number;
    message?: string;
    data?: GetPaymentPlatformData;
  };

  type GetPreSendEmailCountData = {
    count?: string;
  };

  type GetPreSendEmailCountReply = {
    code?: number;
    message?: string;
    data?: GetPreSendEmailCountData;
  };

  type GetPreSendEmailCountRequest = {
    scope?: number;
    registerStartTime?: string;
    registerEndTime?: string;
  };

  type GetPrivacyPolicyConfigReply = {
    code?: number;
    message?: string;
    data?: PrivacyPolicyConfig;
  };

  type GetPrivacyPolicyReply = {
    privacyPolicy?: string;
  };

  type GetRecalculationStatusReply = {
    code?: number;
    message?: string;
    data?: RecalculationState;
  };

  type GetRedemptionCodeListData = {
    total?: number;
    list?: RedemptionCode[];
  };

  type GetRedemptionCodeListReply = {
    code?: number;
    message?: string;
    data?: GetRedemptionCodeListData;
  };

  type GetRedemptionRecordListData = {
    total?: number;
    list?: RedemptionRecord[];
  };

  type GetRedemptionRecordListReply = {
    code?: number;
    message?: string;
    data?: GetRedemptionRecordListData;
  };

  type GetRegisterConfigReply = {
    code?: number;
    message?: string;
    data?: RegisterConfig;
  };

  type GetServerConfigReply = {
    code?: number;
    message?: string;
    basic?: ServerBasic;
    protocol?: string;
    config?: Record<string, any>;
  };

  type GetServerProtocolsData = {
    protocols?: Protocol[];
  };

  type GetServerProtocolsReply = {
    code?: number;
    message?: string;
    data?: GetServerProtocolsData;
  };

  type GetServerUserListReply = {
    code?: number;
    message?: string;
    users?: ServerUser[];
  };

  type GetSiteConfigReply = {
    code?: number;
    message?: string;
    data?: SiteConfig;
  };

  type GetStatReply = {
    user?: string;
    node?: string;
    country?: string;
    protocol?: string[];
  };

  type GetSubscribeApplicationListData = {
    list?: SubscribeApplication[];
    total?: number;
  };

  type GetSubscribeApplicationListReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeApplicationListData;
  };

  type GetSubscribeCategoryListData = {
    list?: SubscribeCategoryInfo[];
    total?: number;
  };

  type GetSubscribeCategoryListReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeCategoryListData;
  };

  type GetSubscribeConfigReply = {
    code?: number;
    message?: string;
    data?: SubscribeConfig;
  };

  type GetSubscribeConfigReply = {
    config?: string;
    header?: string;
  };

  type GetSubscribeDetailsData = {
    subscribe?: SubscribeInfo;
  };

  type GetSubscribeDetailsReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeDetailsData;
  };

  type GetSubscribeGroupListData = {
    list?: SubscribeGroupInfo[];
    total?: number;
  };

  type GetSubscribeGroupListReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeGroupListData;
  };

  type GetSubscribeGroupMappingData = {
    list?: SubscribeGroupMappingItem[];
  };

  type GetSubscribeGroupMappingReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeGroupMappingData;
  };

  type GetSubscribeListData = {
    list?: SubscribeItem[];
    total?: number;
  };

  type GetSubscribeListReply = {
    code?: number;
    message?: string;
    data?: GetSubscribeListData;
  };

  type GetSubscribeLogReply = {
    list?: UserSubscribeLog[];
    total?: number;
  };

  type GetSubscriptionCatalogReply = {
    categories?: SubscribeCategory[];
    uncategorized?: SubscribeInfo[];
    total?: number;
  };

  type GetSubscriptionReply = {
    list?: SubscribeInfo[];
  };

  type GetSystemLogReply = {
    code?: number;
    message?: string;
    data?: LogResponse;
  };

  type GetSystemModuleReply = {
    code?: number;
    message?: string;
    data?: SystemModule;
  };

  type GetTicketListData = {
    total?: number;
    list?: TicketInfo[];
  };

  type GetTicketListReply = {
    code?: number;
    message?: string;
    data?: GetTicketListData;
  };

  type GetTicketReply = {
    code?: number;
    message?: string;
    data?: TicketInfo;
  };

  type GetTosConfigReply = {
    code?: number;
    message?: string;
    data?: TosConfig;
  };

  type GetTosReply = {
    tosContent?: string;
  };

  type GetUserAuthMethodData = {
    authMethods?: UserAuthMethod[];
  };

  type GetUserAuthMethodReply = {
    code?: number;
    message?: string;
    data?: GetUserAuthMethodData;
  };

  type GetUserDetailReply = {
    code?: number;
    message?: string;
    data?: User;
  };

  type GetUserListData = {
    total?: number;
    list?: User[];
  };

  type GetUserListReply = {
    code?: number;
    message?: string;
    data?: GetUserListData;
  };

  type GetUserLoginLogsData = {
    total?: number;
    list?: LoginLog[];
  };

  type GetUserLoginLogsReply = {
    code?: number;
    message?: string;
    data?: GetUserLoginLogsData;
  };

  type GetUserSubscribeByIdReply = {
    code?: number;
    message?: string;
    data?: UserSubscribeDetail;
  };

  type GetUserSubscribeData = {
    total?: number;
    list?: UserSubscribe[];
  };

  type GetUserSubscribeDevicesData = {
    total?: number;
    list?: UserDevice[];
  };

  type GetUserSubscribeDevicesReply = {
    code?: number;
    message?: string;
    data?: GetUserSubscribeDevicesData;
  };

  type GetUserSubscribeLogsData = {
    total?: number;
    list?: UserSubscribeLog[];
  };

  type GetUserSubscribeLogsReply = {
    code?: number;
    message?: string;
    data?: GetUserSubscribeLogsData;
  };

  type GetUserSubscribeReply = {
    code?: number;
    message?: string;
    data?: GetUserSubscribeData;
  };

  type GetUserSubscribeResetTrafficLogsData = {
    total?: number;
    list?: ResetSubscribeTrafficLog[];
  };

  type GetUserSubscribeResetTrafficLogsReply = {
    code?: number;
    message?: string;
    data?: GetUserSubscribeResetTrafficLogsData;
  };

  type GetUserSubscribeTrafficLogsData = {
    total?: number;
    list?: TrafficLog[];
  };

  type GetUserSubscribeTrafficLogsReply = {
    code?: number;
    message?: string;
    data?: GetUserSubscribeTrafficLogsData;
  };

  type GetUserTicketListReply = {
    total?: number;
    list?: TicketInfo[];
  };

  type GetUserTrafficStatsReply = {
    list?: DailyTrafficStats[];
    totalUpload?: string;
    totalDownload?: string;
    totalTraffic?: string;
  };

  type GetVerifyCodeConfigReply = {
    code?: number;
    message?: string;
    data?: VerifyCodeConfig;
  };

  type GetVerifyConfigReply = {
    code?: number;
    message?: string;
    data?: VerifyConfig;
  };

  type GetVersionReply = {
    code?: number;
    message?: string;
    data?: VersionResponse;
  };

  type GiftLog = {
    type?: number;
    userId?: string;
    orderNo?: string;
    subscribeId?: string;
    amount?: string;
    balance?: string;
    remark?: string;
    timestamp?: string;
  };

  type GroupExportGroupResultParams = {
    historyId?: string;
  };

  type GroupGetGroupConfigParams = {
    keys?: string[];
  };

  type GroupGetGroupHistoryDetailParams = {
    id?: string;
  };

  type GroupGetGroupHistoryParams = {
    page?: string;
    size?: string;
    groupMode?: string;
    triggerType?: string;
  };

  type GroupGetNodeGroupListParams = {
    page?: string;
    size?: string;
    groupId?: string;
  };

  type GroupHistory = {
    id?: string;
    groupMode?: string;
    triggerType?: string;
    totalUsers?: number;
    successCount?: number;
    failedCount?: number;
    startTime?: string;
    endTime?: string;
    operator?: string;
    errorLog?: string;
    createdAt?: string;
  };

  type GroupHistoryDetail = {
    id?: string;
    groupMode?: string;
    triggerType?: string;
    totalUsers?: number;
    successCount?: number;
    failedCount?: number;
    startTime?: string;
    endTime?: string;
    operator?: string;
    errorLog?: string;
    createdAt?: string;
    configSnapshot?: string;
    groupDetails?: GroupHistoryDetailItem[];
  };

  type GroupHistoryDetailItem = {
    id?: string;
    historyId?: string;
    userGroupId?: string;
    nodeGroupId?: string;
    userCount?: number;
    nodeCount?: number;
    userData?: string;
    createdAt?: string;
  };

  type GroupPreviewUserNodesParams = {
    userId?: string;
  };

  type HasMigrateServerNodeData = {
    hasMigrate?: boolean;
  };

  type HasMigrateServerNodeReply = {
    code?: number;
    message?: string;
    data?: HasMigrateServerNodeData;
  };

  type HeartbeatReply = {
    status?: boolean;
    message?: string;
    timestamp?: string;
  };

  type InviteConfig = {
    forcedInvite?: boolean;
    referralPercentage?: string;
    onlyFirstPurchase?: boolean;
  };

  type InviteConfig = {
    forcedInvite?: boolean;
    referralPercentage?: string;
    onlyFirstPurchase?: boolean;
  };

  type KickOfflineByUserDeviceData = {
    success?: boolean;
  };

  type KickOfflineByUserDeviceReply = {
    code?: number;
    message?: string;
    data?: KickOfflineByUserDeviceData;
  };

  type KickOfflineByUserDeviceRequest = {
    id?: string;
  };

  type ListAnnouncementsData = {
    list?: Announcement[];
    total?: number;
  };

  type ListAnnouncementsReply = {
    code?: number;
    message?: string;
    data?: ListAnnouncementsData;
  };

  type ListDnsResolversReply = {
    code?: number;
    message?: string;
    data?: DnsResolverListData;
  };

  type ListRouteOutboundsReply = {
    code?: number;
    message?: string;
    data?: RouteOutboundListData;
  };

  type ListRouteProfilesReply = {
    code?: number;
    message?: string;
    data?: RouteProfileListData;
  };

  type ListRouteRulesReply = {
    code?: number;
    message?: string;
    data?: RouteRuleListData;
  };

  type ListUnlockServicesReply = {
    code?: number;
    message?: string;
    data?: UnlockServiceListData;
  };

  type LoginLog = {
    userId?: string;
    method?: string;
    loginIp?: string;
    userAgent?: string;
    success?: boolean;
    timestamp?: string;
  };

  type LoginLog = {
    id?: string;
    userId?: string;
    loginIp?: string;
    userAgent?: string;
    success?: boolean;
    timestamp?: string;
  };

  type LoginRedirectData = {
    redirect?: string;
  };

  type LoginRedirectReply = {
    code?: number;
    message?: string;
    data?: LoginRedirectData;
  };

  type LoginReply = {
    token?: string;
  };

  type LoginTokenData = {
    token?: string;
  };

  type LoginTokenReply = {
    code?: number;
    message?: string;
    data?: LoginTokenData;
  };

  type LogResponse = {
    list?: Record<string, any>[];
  };

  type LogServiceFilterBalanceLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
  };

  type LogServiceFilterCommissionLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
  };

  type LogServiceFilterEmailLogParams = {
    page?: number;
    size?: number;
    date?: string;
    search?: string;
  };

  type LogServiceFilterGiftLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
    search?: string;
  };

  type LogServiceFilterLoginLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
    search?: string;
  };

  type LogServiceFilterMobileLogParams = {
    page?: number;
    size?: number;
    date?: string;
    search?: string;
  };

  type LogServiceFilterRegisterLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
    search?: string;
  };

  type LogServiceFilterResetSubscribeLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userSubscribeId?: string;
    search?: string;
  };

  type LogServiceFilterServerTrafficLogParams = {
    page?: number;
    size?: number;
    date?: string;
    serverId?: string;
  };

  type LogServiceFilterSubscribeLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
    userSubscribeId?: string;
  };

  type LogServiceFilterTrafficLogDetailsParams = {
    page?: number;
    size?: number;
    serverId?: string;
    userId?: string;
    subscribeId?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
  };

  type LogServiceFilterUserSubscribeTrafficLogParams = {
    page?: number;
    size?: number;
    date?: string;
    userId?: string;
    userSubscribeId?: string;
  };

  type LogServiceGetMessageLogListParams = {
    page?: number;
    size?: number;
    type?: number;
    search?: string;
  };

  type LogSetting = {
    autoClear?: boolean;
    clearDays?: string;
  };

  type MarketingServiceGetBatchSendEmailTaskListParams = {
    page?: number;
    size?: number;
    scope?: number;
    status?: number;
  };

  type MarketingServiceQueryQuotaTaskListParams = {
    page?: number;
    size?: number;
    status?: number;
  };

  type MessageLog = {
    id?: string;
    type?: number;
    platform?: string;
    to?: string;
    subject?: string;
    content?: string;
    status?: number;
    createdAt?: string;
  };

  type MigrateServerNodeData = {
    success?: string;
    fail?: string;
  };

  type MigrateServerNodeReply = {
    code?: number;
    message?: string;
    data?: MigrateServerNodeData;
  };

  type MigrateServerNodeRequest = {};

  type MigrateUsersData = {
    successCount?: number;
    failedCount?: number;
  };

  type MigrateUsersReply = {
    code?: number;
    message?: string;
    data?: MigrateUsersData;
  };

  type MigrateUsersRequest = {
    fromUserGroupId?: string;
    toUserGroupId?: string;
    includeLocked?: boolean;
  };

  type MobileAuthConfig = {
    enable?: boolean;
    enableWhitelist?: boolean;
    whitelist?: string[];
  };

  type MobileLog = {
    id?: string;
    type?: number;
    platform?: string;
    to?: string;
    subject?: string;
    content?: string;
    status?: number;
    createdAt?: string;
  };

  type Node = {
    id?: string;
    name?: string;
    address?: string;
    port?: number;
    tags?: string;
    sort?: number;
  };

  type Node = {
    id?: string;
    name?: string;
    tags?: string[];
    port?: number;
    address?: string;
    serverId?: string;
    protocol?: string;
    enabled?: boolean;
    sort?: number;
    nodeGroupId?: string;
    nodeGroupIds?: string[];
    nodeType?: string;
    isHidden?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type NodeConfig = {
    nodeSecret?: string;
    nodePullInterval?: string;
    nodePushInterval?: string;
    trafficReportThreshold?: string;
    ipStrategy?: string;
    dns?: NodeDNS[];
    block?: string[];
    outbound?: NodeOutbound[];
    deviceAdmissionEnabled?: boolean;
    deviceCountMode?: string;
  };

  type NodeDNS = {
    proto?: string;
    address?: string;
    domains?: string[];
  };

  type NodeDNS = {
    server?: string;
    domain?: string;
    port?: string;
  };

  type NodeGroup = {
    id?: string;
    name?: string;
    type?: string;
    description?: string;
    sort?: number;
    forCalculation?: boolean;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: number;
    maxTrafficGbExpired?: string;
    speedLimit?: number;
    minTrafficGb?: string;
    maxTrafficGb?: string;
    nodeCount?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type NodeGroupItem = {
    id?: string;
    name?: string;
    nodes?: Node[];
  };

  type NodeOutbound = {
    name?: string;
    protocol?: string;
    address?: string;
    port?: string;
    password?: string;
    rules?: string[];
  };

  type NodeOutbound = {
    tag?: string;
    protocol?: string;
    settings?: Record<string, any>;
  };

  type OAuthLoginGetTokenRequest = {
    method?: string;
    callback?: string;
    ip?: string;
    userAgent?: string;
  };

  type OAuthLoginRequest = {
    method?: string;
    redirect?: string;
  };

  type OnlineUser = {
    sid?: string;
    ip?: string;
    connectedAt?: string;
  };

  type OrderDetail = {
    id?: string;
    userId?: string;
    orderNo?: string;
    type?: number;
    quantity?: string;
    price?: string;
    amount?: string;
    giftAmount?: string;
    discount?: string;
    coupon?: string;
    couponDiscount?: string;
    commission?: string;
    payment?: PaymentMethod;
    method?: string;
    feeAmount?: string;
    tradeNo?: string;
    status?: number;
    subscribeId?: string;
    subscribe?: Subscribe;
    createdAt?: string;
    updatedAt?: string;
    priceOptionId?: string;
    priceOptionName?: string;
    durationUnit?: string;
    durationValue?: string;
    optionPrice?: string;
  };

  type OrderItem = {
    id?: string;
    parentId?: string;
    userId?: string;
    orderNo?: string;
    type?: number;
    quantity?: string;
    price?: string;
    amount?: string;
    giftAmount?: string;
    discount?: string;
    coupon?: string;
    couponDiscount?: string;
    commission?: string;
    paymentId?: string;
    method?: string;
    feeAmount?: string;
    tradeNo?: string;
    status?: number;
    subscribeId?: string;
    subscribeToken?: string;
    isNew?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type OrderServiceGetOrderListParams = {
    page?: string;
    size?: string;
    userId?: string;
    status?: number;
    subscribeId?: string;
    search?: string;
  };

  type OrdersStatistics = {
    amountTotal?: string;
    newOrderAmount?: string;
    renewalOrderAmount?: string;
    list?: OrdersStatisticsWithDate[];
  };

  type OrdersStatisticsWithDate = {
    date?: string;
    amountTotal?: string;
    newOrderAmount?: string;
    renewalOrderAmount?: string;
  };

  type PaymentConfig = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    domain?: string;
    config?: Record<string, any>;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
    sort?: number;
    enable?: boolean;
  };

  type PaymentMethod = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
  };

  type PaymentMethod = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
  };

  type PaymentMethod = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
  };

  type PaymentMethodDetail = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    domain?: string;
    config?: Record<string, any>;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
    sort?: number;
    enable?: boolean;
    notifyUrl?: string;
  };

  type PaymentMethodsReply = {
    list?: PaymentMethod[];
  };

  type PaymentPlatform = {
    platform?: string;
    platform_url?: string;
    platform_field_description?: Record<string, any>;
  };

  type PaymentServiceDeletePaymentMethodParams = {
    id?: string;
  };

  type PaymentServiceGetPaymentMethodListParams = {
    page?: number;
    size?: number;
    platform?: string;
    search?: string;
    enable?: boolean;
  };

  type Platform = {
    platform?: string;
    platformUrl?: string;
    platformFieldDescription?: Record<string, any>;
  };

  type PlatformListData = {
    list?: Platform[];
  };

  type PlatformListReply = {
    code?: number;
    msg?: string;
    data?: PlatformListData;
  };

  type PreCreateOrderReply = {
    price?: string;
    amount?: string;
    discount?: string;
    giftAmount?: string;
    coupon?: string;
    couponDiscount?: string;
    feeAmount?: string;
  };

  type PreCreateOrderRequest = {
    subscribeId?: string;
    quantity?: string;
    payment?: string;
    coupon?: string;
    priceOptionId?: string;
    type?: number;
  };

  type PrePurchaseOrderReply = {
    price?: string;
    amount?: string;
    discount?: string;
    coupon?: string;
    couponDiscount?: string;
    feeAmount?: string;
  };

  type PrePurchaseOrderRequest = {
    payment?: string;
    subscribeId?: string;
    quantity?: string;
    coupon?: string;
    priceOptionId?: string;
  };

  type PreUnsubscribeReply = {
    deductionAmount?: string;
  };

  type PreUnsubscribeRequest = {
    id?: string;
  };

  type PreViewNodeMultiplierData = {
    currentTime?: string;
    ratio?: number;
  };

  type PreViewNodeMultiplierReply = {
    code?: number;
    message?: string;
    data?: PreViewNodeMultiplierData;
  };

  type PreviewRouteConfigReply = {
    code?: number;
    message?: string;
    data?: PreviewRouteResult;
  };

  type GetRoutingOverviewReply = {
    code?: number;
    message?: string;
    data?: RoutingOverview;
  };

  type PreviewRouteConfigRequest = {
    domain?: string;
    ip?: string;
    port?: number;
    userId?: string;
    nodeId?: string;
    supportedFeatures?: string[];
    subscribeId?: string;
    userSubscribeId?: string;
    subscribeToken?: string;
  };

  type PreviewRouteResult = {
    routingHash?: string;
    profileCode?: string;
    profileName?: string;
    scopeType?: string;
    scopeId?: string;
    matched?: boolean;
    ruleId?: string;
    ruleName?: string;
    actionType?: string;
    dnsResolverTag?: string;
    outboundTag?: string;
    fallbackPolicy?: string;
    unsupportedFeatures?: string[];
    effectiveMode?: string;
    executionEnabled?: boolean;
  };

  type RoutingAuditEvent = {
    id?: string;
    resourceType?: string;
    resourceId?: string;
    resourceName?: string;
    action?: string;
    summary?: string;
    createdAt?: string;
  };

  type RoutingEnforceGuard = {
    key?: string;
    label?: string;
    passed?: boolean;
    status?: string;
    reason?: string;
  };

  type RoutingHealthItem = {
    kind?: string;
    key?: string;
    name?: string;
    status?: string;
    source?: string;
    checkedAt?: string;
    rttMs?: number;
    consecutiveFailures?: number;
    lastError?: string;
    outboundTag?: string;
    dnsResolverTag?: string;
  };

  type RoutingOverview = {
    routingHash?: string;
    generatedAt?: string;
    profileCode?: string;
    profileName?: string;
    mode?: string;
    profileEnabled?: boolean;
    enforceReady?: boolean;
    executionEnabled?: boolean;
    rollbackAction?: string;
    compileError?: string;
    health?: RoutingHealthItem[];
    guards?: RoutingEnforceGuard[];
    auditEvents?: RoutingAuditEvent[];
  };

  type PreviewSubscribeTemplateData = {
    template?: string;
  };

  type PreviewSubscribeTemplateReply = {
    code?: number;
    message?: string;
    data?: PreviewSubscribeTemplateData;
  };

  type PreviewUserNodesData = {
    userId?: string;
    nodeGroups?: NodeGroupItem[];
  };

  type PreviewUserNodesReply = {
    code?: number;
    message?: string;
    data?: PreviewUserNodesData;
  };

  type PrivacyPolicyConfig = {
    privacyPolicy?: string;
  };

  type Protocol = {
    type?: string;
    port?: number;
    enable?: boolean;
    security?: string;
    sni?: string;
    allowInsecure?: boolean;
    fingerprint?: string;
    realityServerAddr?: string;
    realityServerPort?: number;
    realityPrivateKey?: string;
    realityPublicKey?: string;
    realityShortId?: string;
    transport?: string;
    host?: string;
    path?: string;
    serviceName?: string;
    cipher?: string;
    serverKey?: string;
    flow?: string;
    hopPorts?: string;
    hopInterval?: number;
    obfsPassword?: string;
    disableSni?: boolean;
    reduceRtt?: boolean;
    udpRelayMode?: string;
    congestionController?: string;
    multiplex?: string;
    paddingScheme?: string;
    upMbps?: number;
    downMbps?: number;
    obfs?: string;
    obfsHost?: string;
    obfsPath?: string;
    xhttpMode?: string;
    xhttpExtra?: string;
    encryption?: string;
    encryptionMode?: string;
    encryptionRtt?: string;
    encryptionTicket?: string;
    encryptionServerPadding?: string;
    encryptionPrivateKey?: string;
    encryptionClientPadding?: string;
    encryptionPassword?: string;
    ratio?: number;
    certMode?: string;
    certDnsProvider?: string;
    certDnsEnv?: string;
    simnetPsk?: string;
    simnetKeyId?: number;
    simnetTicketId?: string;
    simnetPath?: string;
    simnetCarrier?: string;
    simnetAfEnabled?: boolean;
    simnetAfPathMode?: string;
    simnetAfPathPrefix?: string;
    simnetAfPathSuffix?: string;
    simnetAfMagicMode?: string;
    simnetAfResponseJitterMs?: number;
    simnetAfHandshakePolymorphism?: boolean;
    simnetAfSettingsJitter?: boolean;
    simnetAfFakeHeaderInjection?: boolean;
    simnetReverseEnabled?: boolean;
    simnetReverseListenAddr?: string;
    simnetReverseListenPort?: number;
    simnetReverseTargetHost?: string;
    simnetReverseTargetPort?: number;
    simnetFallbackEnabled?: boolean;
    simnetFallbackTargetScheme?: string;
    simnetFallbackTargetHost?: string;
    simnetFallbackTargetPort?: number;
    simnetFallbackHostHeader?: string;
    simnetFallbackTlsSni?: string;
    simnetInboundMaxStreamsPerSession?: number;
    simnetInboundMaxHandlerTasksPerSession?: number;
    simnetStreamEventChannelCapacity?: number;
    simnetStreamDataChannelCapacity?: number;
    simnetTargetDialTimeoutMs?: number;
    simnetTargetMaxConcurrentDials?: number;
    simnetEgressBlockLoopback?: boolean;
    simnetEgressBlockPrivate?: boolean;
    simnetEgressBlockLinkLocal?: boolean;
    simnetEgressBlockMetadata?: boolean;
    simnetSendWindow?: number;
    simnetRecvWindow?: number;
    simnetMaxConcurrentStreams?: number;
    simnetInitialWindowSize?: number;
    simnetMaxFrameSize?: number;
    simnetClientMaxConcurrentStreams?: number;
    simnetClientMaxStreamsPerSession?: number;
    simnetClientSessionIdleTimeoutSecs?: number;
    simnetInboundMaxUdpStreamsPerSession?: number;
    simnetClientMaxUdpSessions?: number;
    /** OmniFlow 基础配置 */
    omniflowCarrier?: string;
    omniflowPath?: string;
    omniflowContentType?: string;
    omniflowProfilePath?: string;
    omniflowProfileJson?: string;
    omniflowServerHost?: string;
    omniflowServerPort?: number;
    omniflowCaCertPath?: string;
    omniflowTargetMeta?: string;
    omniflowSpkiPin?: string;
    /** OmniFlow H3 Fallback */
    omniflowH3FallbackEnabled?: boolean;
    omniflowH3FallbackPolicy?: string;
    omniflowH3FallbackTimeoutMs?: number;
    omniflowH3FallbackRetryBudget?: number;
    omniflowH3FallbackSmokeEnabled?: boolean;
    omniflowH3FallbackSmokeIntervalSec?: number;
    omniflowH3FallbackSmokeTimeoutMs?: number;
    /** OmniFlow 连接管理 */
    omniflowMaxAgeSec?: number;
    omniflowIdleTimeoutSec?: number;
    omniflowMaxConnections?: number;
    /** OmniFlow 抗指纹 */
    omniflowAdaptiveTlsEnabled?: boolean;
    omniflowTlsFingerprint?: string;
    omniflowSniMode?: string;
    omniflowPaddingMode?: string;
    omniflowTrafficShapingEnabled?: boolean;
    omniflowAfEnabled?: boolean;
    omniflowAfPathMode?: string;
    omniflowAfPathPrefix?: string;
    omniflowAfPathSuffix?: string;
    omniflowAfPathRotationSecs?: number;
    omniflowAfPathSkewSlots?: number;
    /** OmniFlow 同端口浏览器 Fallback 反向代理 */
    omniflowFallbackEnabled?: boolean;
    omniflowFallbackTargetScheme?: string;
    omniflowFallbackTargetHost?: string;
    omniflowFallbackTargetPort?: number;
    omniflowFallbackHostHeader?: string;
    omniflowFallbackTlsSni?: string;
    /** OmniFlow 回退 Carrier */
    omniflowFallbackCarrierEnabled?: boolean;
    omniflowFallbackConnectTunnel?: boolean;
    omniflowFallbackWssEnabled?: boolean;
    mc1Mode?: string;
    mc1CidrSegments?: string[];
    mundoUsername?: string;
    mundoCertificateFingerprint?: string;
    mundoFakeTitle?: string;
    mundoFakeMessage?: string;
    mundoAcceptProxyProtocol?: boolean;
    mundoUseTlsCertificate?: boolean;
  };

  type Protocol = {
    type?: string;
    port?: number;
    enable?: boolean;
    security?: string;
    sni?: string;
    allowInsecure?: boolean;
    fingerprint?: string;
    realityServerAddr?: string;
    realityServerPort?: number;
    realityPrivateKey?: string;
    realityPublicKey?: string;
    realityShortId?: string;
    transport?: string;
    host?: string;
    path?: string;
    serviceName?: string;
    cipher?: string;
    serverKey?: string;
    flow?: string;
    hopPorts?: string;
    hopInterval?: number;
    obfsPassword?: string;
    disableSni?: boolean;
    reduceRtt?: boolean;
    udpRelayMode?: string;
    congestionController?: string;
    multiplex?: string;
    paddingScheme?: string;
    upMbps?: number;
    downMbps?: number;
    obfs?: string;
    obfsHost?: string;
    obfsPath?: string;
    xhttpMode?: string;
    xhttpExtra?: string;
    encryption?: string;
    encryptionMode?: string;
    encryptionRtt?: string;
    encryptionTicket?: string;
    encryptionServerPadding?: string;
    encryptionPrivateKey?: string;
    encryptionClientPadding?: string;
    encryptionPassword?: string;
    ratio?: number;
    certMode?: string;
    certDnsProvider?: string;
    certDnsEnv?: string;
    simnetPsk?: string;
    simnetKeyId?: number;
    simnetTicketId?: string;
    simnetPath?: string;
    simnetCarrier?: string;
    simnetAfEnabled?: boolean;
    simnetAfPathMode?: string;
    simnetAfPathPrefix?: string;
    simnetAfPathSuffix?: string;
    simnetAfMagicMode?: string;
    simnetAfResponseJitterMs?: number;
    simnetAfHandshakePolymorphism?: boolean;
    simnetAfSettingsJitter?: boolean;
    simnetAfFakeHeaderInjection?: boolean;
    simnetReverseEnabled?: boolean;
    simnetReverseListenAddr?: string;
    simnetReverseListenPort?: number;
    simnetReverseTargetHost?: string;
    simnetReverseTargetPort?: number;
    simnetFallbackEnabled?: boolean;
    simnetFallbackTargetScheme?: string;
    simnetFallbackTargetHost?: string;
    simnetFallbackTargetPort?: number;
    simnetFallbackHostHeader?: string;
    simnetFallbackTlsSni?: string;
    simnetInboundMaxStreamsPerSession?: number;
    simnetInboundMaxHandlerTasksPerSession?: number;
    simnetStreamEventChannelCapacity?: number;
    simnetStreamDataChannelCapacity?: number;
    simnetTargetDialTimeoutMs?: number;
    simnetTargetMaxConcurrentDials?: number;
    simnetEgressBlockLoopback?: boolean;
    simnetEgressBlockPrivate?: boolean;
    simnetEgressBlockLinkLocal?: boolean;
    simnetEgressBlockMetadata?: boolean;
    simnetSendWindow?: number;
    simnetRecvWindow?: number;
    simnetMaxConcurrentStreams?: number;
    simnetInitialWindowSize?: number;
    simnetMaxFrameSize?: number;
    simnetClientMaxConcurrentStreams?: number;
    simnetClientMaxStreamsPerSession?: number;
    simnetClientSessionIdleTimeoutSecs?: number;
    simnetInboundMaxUdpStreamsPerSession?: number;
    simnetClientMaxUdpSessions?: number;
    /** OmniFlow 基础配置 */
    omniflowCarrier?: string;
    omniflowPath?: string;
    omniflowContentType?: string;
    omniflowProfilePath?: string;
    omniflowProfileJson?: string;
    omniflowServerHost?: string;
    omniflowServerPort?: number;
    omniflowCaCertPath?: string;
    omniflowTargetMeta?: string;
    omniflowSpkiPin?: string;
    /** OmniFlow H3 Fallback */
    omniflowH3FallbackEnabled?: boolean;
    omniflowH3FallbackPolicy?: string;
    omniflowH3FallbackTimeoutMs?: number;
    omniflowH3FallbackRetryBudget?: number;
    omniflowH3FallbackSmokeEnabled?: boolean;
    omniflowH3FallbackSmokeIntervalSec?: number;
    omniflowH3FallbackSmokeTimeoutMs?: number;
    /** OmniFlow 连接管理 */
    omniflowMaxAgeSec?: number;
    omniflowIdleTimeoutSec?: number;
    omniflowMaxConnections?: number;
    /** OmniFlow 抗指纹 */
    omniflowAdaptiveTlsEnabled?: boolean;
    omniflowTlsFingerprint?: string;
    omniflowSniMode?: string;
    omniflowPaddingMode?: string;
    omniflowTrafficShapingEnabled?: boolean;
    omniflowAfEnabled?: boolean;
    omniflowAfPathMode?: string;
    omniflowAfPathPrefix?: string;
    omniflowAfPathSuffix?: string;
    omniflowAfPathRotationSecs?: number;
    omniflowAfPathSkewSlots?: number;
    /** OmniFlow 同端口浏览器 Fallback 反向代理 */
    omniflowFallbackEnabled?: boolean;
    omniflowFallbackTargetScheme?: string;
    omniflowFallbackTargetHost?: string;
    omniflowFallbackTargetPort?: number;
    omniflowFallbackHostHeader?: string;
    omniflowFallbackTlsSni?: string;
    /** OmniFlow 回退 Carrier */
    omniflowFallbackCarrierEnabled?: boolean;
    omniflowFallbackConnectTunnel?: boolean;
    omniflowFallbackWssEnabled?: boolean;
    mc1Mode?: string;
    mc1CidrSegments?: string[];
    mundoUsername?: string;
    mundoCertificateFingerprint?: string;
    mundoFakeTitle?: string;
    mundoFakeMessage?: string;
    mundoAcceptProxyProtocol?: boolean;
    mundoUseTlsCertificate?: boolean;
  };

  type PublicVerifyCodeConfig = {
    verifyCodeInterval?: string;
  };

  type PurchaseCheckoutReply = {
    type?: string;
    checkoutUrl?: string;
    stripe?: StripePayment;
  };

  type PurchaseCheckoutRequest = {
    orderNo?: string;
    returnUrl?: string;
  };

  type PurchaseReply = {
    orderNo?: string;
  };

  type PurchaseReply = {
    orderNo?: string;
  };

  type PurchaseRequest = {
    subscribeId?: string;
    quantity?: string;
    payment?: string;
    coupon?: string;
    priceOptionId?: string;
  };

  type PurchaseRequest = {
    authType?: string;
    identifier?: string;
    password?: string;
    payment?: string;
    subscribeId?: string;
    quantity?: string;
    coupon?: string;
    inviteCode?: string;
    turnstileToken?: string;
    priceOptionId?: string;
  };

  type PushOnlineUsersReply = {
    code?: number;
    message?: string;
  };

  type PushOnlineUsersRequest = {
    serverId?: string;
    protocol?: string;
    secretKey?: string;
    users?: OnlineUser[];
    port?: number;
  };

  type PushServerStatusReply = {
    code?: number;
    message?: string;
  };

  type PushServerStatusRequest = {
    serverId?: string;
    protocol?: string;
    secretKey?: string;
    cpu?: number;
    mem?: number;
    disk?: number;
    updatedAt?: string;
    port?: number;
  };

  type PushUserTrafficReply = {
    code?: number;
    message?: string;
  };

  type PushUserTrafficRequest = {
    serverId?: string;
    protocol?: string;
    secretKey?: string;
    traffic?: UserTraffic[];
    port?: number;
  };

  type QueryAnnouncementReply = {
    total?: number;
    announcements?: AnnouncementItem[];
  };

  type QueryIPLocationReply = {
    code?: number;
    message?: string;
    data?: QueryIPLocationResponse;
  };

  type QueryIPLocationResponse = {
    country?: string;
    region?: string;
    city?: string;
  };

  type QueryNodeTagData = {
    tags?: string[];
  };

  type QueryNodeTagReply = {
    code?: number;
    message?: string;
    data?: QueryNodeTagData;
  };

  type QueryOrderListReply = {
    total?: number;
    list?: OrderDetail[];
  };

  type QueryPurchaseOrderReply = {
    orderNo?: string;
    subscribe?: SubscribeInfo;
    quantity?: string;
    price?: string;
    amount?: string;
    discount?: string;
    coupon?: string;
    couponDiscount?: string;
    feeAmount?: string;
    payment?: PaymentMethod;
    status?: number;
    createdAt?: string;
    token?: string;
    priceOptionId?: string;
    priceOptionName?: string;
    durationUnit?: string;
    durationValue?: string;
    optionPrice?: string;
  };

  type QueryQuotaTaskListData = {
    total?: number;
    list?: QuotaTask[];
  };

  type QueryQuotaTaskListReply = {
    code?: number;
    message?: string;
    data?: QueryQuotaTaskListData;
  };

  type QueryQuotaTaskPreCountData = {
    count?: string;
  };

  type QueryQuotaTaskPreCountReply = {
    code?: number;
    message?: string;
    data?: QueryQuotaTaskPreCountData;
  };

  type QueryQuotaTaskPreCountRequest = {
    subscribers?: string[];
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
  };

  type QueryRevenueStatisticsData = {
    today?: OrdersStatistics;
    monthly?: OrdersStatistics;
    all?: OrdersStatistics;
  };

  type QueryRevenueStatisticsReply = {
    code?: number;
    message?: string;
    data?: QueryRevenueStatisticsData;
  };

  type QueryServerProtocolConfigReply = {
    code?: number;
    message?: string;
    trafficReportThreshold?: string;
    ipStrategy?: string;
    dns?: NodeDNS[];
    block?: string[];
    outbound?: NodeOutbound[];
    protocols?: Protocol[];
    total?: number;
  };

  type QueryServerTotalDataData = {
    onlineUsers?: string;
    onlineServers?: string;
    offlineServers?: string;
    todayUpload?: string;
    todayDownload?: string;
    monthlyUpload?: string;
    monthlyDownload?: string;
    updatedAt?: string;
    serverTrafficRankingToday?: ServerTrafficData[];
    serverTrafficRankingYesterday?: ServerTrafficData[];
    userTrafficRankingToday?: UserTrafficData[];
    userTrafficRankingYesterday?: UserTrafficData[];
  };

  type QueryServerTotalDataReply = {
    code?: number;
    message?: string;
    data?: QueryServerTotalDataData;
  };

  type QuerySubscribeCatalogReply = {
    categories?: SubscribeCategory[];
    uncategorized?: Subscribe[];
    total?: number;
  };

  type QuerySubscribeListReply = {
    list?: Subscribe[];
    total?: number;
  };

  type QueryTicketWaitReplyData = {
    count?: string;
  };

  type QueryTicketWaitReplyReply = {
    code?: number;
    message?: string;
    data?: QueryTicketWaitReplyData;
  };

  type QueryUserAffiliateCountReply = {
    registers?: string;
    totalCommission?: string;
  };

  type QueryUserAffiliateListReply = {
    list?: UserAffiliate[];
    total?: number;
  };

  type QueryUserBalanceLogReply = {
    list?: BalanceLog[];
    total?: number;
  };

  type QueryUserCommissionLogReply = {
    list?: CommissionLog[];
    total?: number;
  };

  type QueryUserStatisticsData = {
    today?: UserStatistics;
    monthly?: UserStatistics;
    all?: UserStatistics;
  };

  type QueryUserStatisticsReply = {
    code?: number;
    message?: string;
    data?: QueryUserStatisticsData;
  };

  type QueryUserSubscribeNodeListReply = {
    list?: UserSubscribeInfo[];
  };

  type QueryUserSubscribeReply = {
    list?: UserSubscribe[];
    total?: number;
  };

  type QueryWithdrawalLogReply = {
    list?: WithdrawalLog[];
    total?: number;
  };

  type QuotaTask = {
    id?: string;
    subscribers?: string[];
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
    resetTraffic?: boolean;
    days?: string;
    giftType?: number;
    giftValue?: string;
    objects?: string[];
    status?: number;
    total?: number;
    current?: number;
    errors?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type RecalculateGroupData = {
    historyId?: string;
  };

  type RecalculateGroupReply = {
    code?: number;
    message?: string;
    data?: RecalculateGroupData;
  };

  type RecalculateGroupRequest = {
    mode?: string;
    triggerType?: string;
  };

  type RecalculationState = {
    state?: string;
    progress?: string;
    total?: number;
  };

  type RechargeReply = {
    orderNo?: string;
  };

  type RechargeRequest = {
    amount?: string;
    payment?: string;
  };

  type RedeemCodeReply = {
    message?: string;
  };

  type RedeemCodeRequest = {
    code?: string;
  };

  type RedemptionCode = {
    id?: string;
    code?: string;
    totalCount?: number;
    usedCount?: number;
    subscribePlan?: string;
    unitTime?: string;
    quantity?: number;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type RedemptionGetRedemptionCodeListParams = {
    page?: string;
    size?: string;
    subscribePlan?: string;
    unitTime?: string;
    code?: string;
  };

  type RedemptionGetRedemptionRecordListParams = {
    page?: string;
    size?: string;
    userId?: string;
    codeId?: string;
  };

  type RedemptionRecord = {
    id?: string;
    redemptionCodeId?: string;
    userId?: string;
    subscribeId?: string;
    unitTime?: string;
    quantity?: number;
    redeemedAt?: string;
    createdAt?: string;
  };

  type RegisterConfig = {
    stopRegister?: boolean;
    enableTrial?: boolean;
    trialSubscribe?: string;
    trialTime?: string;
    trialTimeUnit?: string;
    enableIpRegisterLimit?: boolean;
    ipRegisterLimit?: string;
    ipRegisterLimitDuration?: string;
    deviceLimit?: string;
  };

  type RegisterConfig = {
    stopRegister?: boolean;
    enableIpRegisterLimit?: boolean;
    ipRegisterLimit?: string;
    ipRegisterLimitDuration?: string;
  };

  type RegisterLog = {
    userId?: string;
    authMethod?: string;
    identifier?: string;
    registerIp?: string;
    userAgent?: string;
    timestamp?: string;
  };

  type RenewalReply = {
    orderNo?: string;
  };

  type RenewalRequest = {
    userSubscribeId?: string;
    quantity?: string;
    payment?: string;
    coupon?: string;
    priceOptionId?: string;
  };

  type ResetAllSubscribeTokenData = {
    success?: boolean;
  };

  type ResetAllSubscribeTokenReply = {
    code?: number;
    message?: string;
    data?: ResetAllSubscribeTokenData;
  };

  type ResetAllSubscribeTokenRequest = {};

  type ResetGroupsData = {
    success?: boolean;
  };

  type ResetGroupsReply = {
    code?: number;
    message?: string;
    data?: ResetGroupsData;
  };

  type ResetGroupsRequest = {
    confirm?: boolean;
  };

  type ResetPasswordReply = {
    userId?: string;
    token?: string;
    email?: string;
  };

  type ResetPasswordRequest = {
    email?: string;
    verificationCode?: string;
    newPassword?: string;
  };

  type ResetPasswordRequest = {
    email?: string;
    password?: string;
    code?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type ResetSortData = {
    success?: boolean;
  };

  type ResetSortReply = {
    code?: number;
    message?: string;
    data?: ResetSortData;
  };

  type ResetSortRequest = {
    sort?: SortItem[];
  };

  type ResetSubscribeLog = {
    type?: number;
    userId?: string;
    userSubscribeId?: string;
    orderNo?: string;
    timestamp?: string;
  };

  type ResetSubscribeTrafficLog = {
    id?: string;
    type?: number;
    userSubscribeId?: string;
    orderNo?: string;
    timestamp?: string;
  };

  type ResetTrafficReply = {
    orderNo?: string;
  };

  type ResetTrafficRequest = {
    userSubscribeId?: string;
    payment?: string;
  };

  type ResetUserSubscribeTokenReply = {
    code?: number;
    message?: string;
  };

  type ResetUserSubscribeTokenRequest = {
    userSubscribeId?: string;
  };

  type ResetUserSubscribeTokenRequest = {
    userSubscribeId?: string;
  };

  type ResetUserSubscribeTrafficReply = {
    code?: number;
    message?: string;
  };

  type ResetUserSubscribeTrafficRequest = {
    userSubscribeId?: string;
  };

  type RestartSystemReply = {
    code?: number;
    message?: string;
  };

  type RouteOutbound = {
    id?: string;
    tag?: string;
    name?: string;
    type?: string;
    region?: string;
    enabled?: boolean;
    outboundJson?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type RouteOutboundData = {
    outbound?: RouteOutbound;
  };

  type RouteOutboundListData = {
    list?: RouteOutbound[];
    total?: number;
  };

  type RouteOutboundReply = {
    code?: number;
    message?: string;
    data?: RouteOutboundData;
  };

  type RouteProfile = {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    scopeType?: string;
    scopeId?: string;
    priority?: number;
    mode?: string;
    enabled?: boolean;
    profileJson?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type RouteProfileData = {
    profile?: RouteProfile;
  };

  type RouteProfileListData = {
    list?: RouteProfile[];
    total?: number;
  };

  type RouteProfileReply = {
    code?: number;
    message?: string;
    data?: RouteProfileData;
  };

  type RouteRule = {
    id?: string;
    profileId?: string;
    name?: string;
    priority?: number;
    enabled?: boolean;
    serviceCode?: string;
    matcherJson?: string;
    actionJson?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type RouteRuleData = {
    rule?: RouteRule;
  };

  type RouteRuleListData = {
    list?: RouteRule[];
    total?: number;
  };

  type RouteRuleReply = {
    code?: number;
    message?: string;
    data?: RouteRuleData;
  };

  type RoutingServiceDeleteDnsResolverParams = {
    id?: string;
  };

  type RoutingServiceDeleteRouteOutboundParams = {
    id?: string;
  };

  type RoutingServiceDeleteRouteProfileParams = {
    id?: string;
  };

  type RoutingServiceDeleteRouteRuleParams = {
    id?: string;
  };

  type RoutingServiceDeleteUnlockServiceParams = {
    id?: string;
  };

  type RoutingServiceListDnsResolversParams = {
    page?: string;
    size?: string;
    search?: string;
  };

  type RoutingServiceListRouteOutboundsParams = {
    page?: string;
    size?: string;
    search?: string;
  };

  type RoutingServiceListRouteProfilesParams = {
    page?: string;
    size?: string;
    search?: string;
  };

  type RoutingServiceListRouteRulesParams = {
    page?: string;
    size?: string;
    profileId?: string;
    search?: string;
  };

  type RoutingServiceListUnlockServicesParams = {
    page?: string;
    size?: string;
    search?: string;
  };

  type SendCodeReply = {
    status?: boolean;
  };

  type SendEmailCodeRequest = {
    email?: string;
    type?: number;
  };

  type SendSmsCodeRequest = {
    type?: number;
    telephone?: string;
    telephoneAreaCode?: string;
  };

  type Server = {
    id?: string;
    name?: string;
    country?: string;
    city?: string;
    address?: string;
    sort?: number;
    protocols?: Protocol[];
    lastReportedAt?: string;
    status?: ServerStatus;
    createdAt?: string;
    updatedAt?: string;
  };

  type ServerBasic = {
    pushInterval?: string;
    pullInterval?: string;
    deviceCountMode?: string;
    deviceAdmissionEnabled?: boolean;
  };

  type ServerOnlineIP = {
    ip?: string;
    protocol?: string;
  };

  type ServerOnlineUser = {
    ip?: ServerOnlineIP[];
    userId?: string;
    subscribe?: string;
    subscribeId?: string;
    traffic?: string;
    expiredAt?: string;
  };

  type ServerServiceFilterNodeListParams = {
    page?: number;
    size?: number;
    search?: string;
    nodeGroupId?: string;
  };

  type ServerServiceFilterServerListParams = {
    page?: number;
    size?: number;
    search?: string;
  };

  type ServerServiceGetServerProtocolsParams = {
    id?: string;
  };

  type ServerStatus = {
    cpu?: number;
    mem?: number;
    disk?: number;
    protocol?: string;
    online?: ServerOnlineUser[];
    status?: string;
  };

  type ServerTrafficData = {
    serverId?: string;
    name?: string;
    upload?: string;
    download?: string;
  };

  type ServerTrafficLog = {
    serverId?: string;
    upload?: string;
    download?: string;
    total?: number;
    date?: string;
    details?: boolean;
  };

  type ServerUser = {
    id?: string;
    uuid?: string;
    speedLimit?: string;
    deviceLimit?: string;
  };

  type SessionCheckRequest = {
    serverId?: string;
    secretKey?: string;
    userId?: string;
    clientIp?: string;
    protocol?: string;
    connectionId?: string;
  };

  type SessionCheckResponse = {
    allowed?: boolean;
    current?: string;
    limit?: string;
    reason?: string;
  };

  type SessionReleaseRequest = {
    serverId?: string;
    secretKey?: string;
    userId?: string;
    clientIp?: string;
    connectionId?: string;
  };

  type SessionReleaseResponse = {
    success?: boolean;
  };

  type SetNodeMultiplierData = {
    success?: boolean;
  };

  type SetNodeMultiplierReply = {
    code?: number;
    message?: string;
    data?: SetNodeMultiplierData;
  };

  type SetNodeMultiplierRequest = {
    periods?: TimePeriod[];
  };

  type SettingTelegramBotData = {
    success?: boolean;
  };

  type SettingTelegramBotReply = {
    code?: number;
    message?: string;
    data?: SettingTelegramBotData;
  };

  type SettingTelegramBotRequest = {};

  type SiteConfig = {
    host?: string;
    siteName?: string;
    siteDesc?: string;
    siteLogo?: string;
    keywords?: string;
    customHtml?: string;
    customData?: string;
  };

  type SiteConfig = {
    host?: string;
    siteName?: string;
    siteDesc?: string;
    siteLogo?: string;
    keywords?: string;
    customHtml?: string;
    customData?: string;
  };

  type SortItem = {
    id?: string;
    sort?: number;
  };

  type SortItem = {
    id?: string;
    sort?: number;
  };

  type StopBatchSendEmailTaskData = {
    success?: boolean;
  };

  type StopBatchSendEmailTaskReply = {
    code?: number;
    message?: string;
    data?: StopBatchSendEmailTaskData;
  };

  type StopBatchSendEmailTaskRequest = {
    id?: string;
  };

  type StripeNotifyReply = {
    code?: number;
    message?: string;
  };

  type StripePayment = {
    publishableKey?: string;
    clientSecret?: string;
    method?: string;
  };

  type Subscribe = {
    id?: string;
    name?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    resetCycle?: number;
    createdAt?: string;
    updatedAt?: string;
    language?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    quota?: number;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    trafficLimit?: TrafficLimit[];
  };

  type Subscribe = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    categoryName?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type Subscribe = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    categoryName?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type Subscribe = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type SubscribeApplication = {
    id?: string;
    name?: string;
    icon?: string;
    description?: string;
    scheme?: string;
    userAgent?: string;
    isDefault?: boolean;
    template?: string;
    outputFormat?: string;
    downloadLink?: DownloadLink;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribeApplicationData = {
    application?: SubscribeApplication;
  };

  type SubscribeApplicationReply = {
    code?: number;
    message?: string;
    data?: SubscribeApplicationData;
  };

  type SubscribeApplicationServiceGetSubscribeApplicationListParams = {
    page?: string;
    size?: string;
  };

  type SubscribeApplicationServicePreviewSubscribeTemplateParams = {
    id?: string;
  };

  type SubscribeCategory = {
    id?: string;
    parentId?: string;
    name?: string;
    description?: string;
    language?: string;
    show?: boolean;
    sort?: number;
    list?: SubscribeInfo[];
    children?: SubscribeCategory[];
  };

  type SubscribeCategory = {
    id?: string;
    parentId?: string;
    name?: string;
    description?: string;
    language?: string;
    show?: boolean;
    sort?: number;
    list?: Subscribe[];
    children?: SubscribeCategory[];
  };

  type SubscribeCategoryInfo = {
    id?: string;
    parentId?: string | number;
    parent_id?: string | number;
    name?: string;
    description?: string;
    language?: string;
    show?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribeClient = {
    id?: string;
    name?: string;
    description?: string;
    icon?: string;
    scheme?: string;
    isDefault?: boolean;
    downloadLink?: DownloadLink;
  };

  type SubscribeConfig = {
    singleModel?: boolean;
    subscribePath?: string;
    subscribeDomain?: string;
    panDomain?: boolean;
    userAgentLimit?: boolean;
    userAgentList?: string;
  };

  type SubscribeConfig = {
    singleModel?: boolean;
    subscribePath?: string;
    subscribeDomain?: string;
    panDomain?: boolean;
    userAgentLimit?: boolean;
    userAgentList?: string;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: string;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: string;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: string;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: string;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: number;
  };

  type SubscribeDiscount = {
    quantity?: string;
    discount?: number;
  };

  type SubscribeGetSubscribeCategoryListParams = {
    language?: string;
    parentId?: string;
    show?: boolean;
  };

  type SubscribeGetSubscribeDetailsParams = {
    id?: string;
  };

  type SubscribeGetSubscribeListParams = {
    page?: string;
    size?: string;
    language?: string;
    search?: string;
    nodeGroupId?: string;
    categoryId?: string;
  };

  type SubscribeGroupInfo = {
    id?: string;
    name?: string;
    description?: string;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: number;
    maxTrafficGbExpired?: number;
    speedLimit?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribeGroupMappingItem = {
    subscribeName?: string;
    nodeGroupName?: string;
  };

  type SubscribeInfo = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    categoryName?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type SubscribeInfo = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    categoryName?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type SubscribeItem = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    categoryName?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    createdAt?: string;
    updatedAt?: string;
    sold?: string;
    priceOptions?: SubscribePriceOption[];
  };

  type SubscribeLog = {
    userId?: string;
    token?: string;
    userAgent?: string;
    clientIp?: string;
    userSubscribeId?: string;
    timestamp?: string;
  };

  type SubscribePriceOption = {
    id?: string;
    subscribeId?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: string;
    price?: string;
    originalPrice?: string;
    inventory?: number;
    show?: boolean;
    sell?: boolean;
    isDefault?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribePriceOption = {
    id?: string;
    subscribeId?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: string;
    price?: string;
    originalPrice?: string;
    inventory?: number;
    show?: boolean;
    sell?: boolean;
    isDefault?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribePriceOption = {
    id?: string;
    subscribeId?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: string;
    price?: string;
    originalPrice?: string;
    inventory?: number;
    show?: boolean;
    sell?: boolean;
    isDefault?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribePriceOption = {
    id?: string;
    subscribeId?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: string;
    price?: string;
    originalPrice?: string;
    inventory?: number;
    show?: boolean;
    sell?: boolean;
    isDefault?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribePriceOption = {
    id?: string;
    subscribeId?: string;
    name?: string;
    durationUnit?: string;
    durationValue?: string;
    price?: string;
    originalPrice?: string;
    inventory?: number;
    show?: boolean;
    sell?: boolean;
    isDefault?: boolean;
    sort?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscribeSortData = {
    success?: boolean;
  };

  type SubscribeSortReply = {
    code?: number;
    message?: string;
    data?: SubscribeSortData;
  };

  type SubscribeSortRequest = {
    sort?: SortItem[];
  };

  type SystemModule = {
    serviceName?: string;
    serviceVersion?: string;
    secret?: string;
  };

  type TelephoneLoginReply = {
    userId?: string;
    token?: string;
    telephone?: string;
  };

  type TelephoneLoginRequest = {
    telephone?: string;
    password?: string;
  };

  type TelephoneLoginRequest = {
    telephone?: string;
    telephoneAreaCode?: string;
    password?: string;
    telephoneCode?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type TelephoneRegisterRequest = {
    telephone?: string;
    telephoneAreaCode?: string;
    password?: string;
    invite?: string;
    code?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type TelephoneResetPasswordReply = {
    userId?: string;
    token?: string;
    telephone?: string;
  };

  type TelephoneResetPasswordRequest = {
    telephone?: string;
    verificationCode?: string;
    newPassword?: string;
  };

  type TelephoneResetPasswordRequest = {
    telephone?: string;
    telephoneAreaCode?: string;
    password?: string;
    code?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type TelephoneUserRegisterReply = {
    userId?: string;
    token?: string;
    telephone?: string;
  };

  type TelephoneUserRegisterRequest = {
    telephone?: string;
    password?: string;
  };

  type TestEmailSendRequest = {
    email?: string;
  };

  type TestSmsSendRequest = {
    areaCode?: string;
    telephone?: string;
  };

  type TicketFollow = {
    id?: string;
    ticketId?: string;
    from?: string;
    type?: number;
    content?: string;
    createdAt?: string;
  };

  type TicketFollow = {
    id?: string;
    ticketId?: string;
    from?: string;
    type?: number;
    content?: string;
    createdAt?: string;
  };

  type TicketGetTicketListParams = {
    page?: string;
    size?: string;
    userId?: string;
    status?: number;
    search?: string;
  };

  type TicketGetTicketParams = {
    id?: string;
  };

  type TicketInfo = {
    id?: string;
    title?: string;
    description?: string;
    userId?: string;
    follow?: TicketFollow[];
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type TicketInfo = {
    id?: string;
    title?: string;
    description?: string;
    userId?: string;
    follow?: TicketFollow[];
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type TimePeriod = {
    startTime?: string;
    endTime?: string;
    multiplier?: number;
  };

  type ToggleNodeStatusData = {
    node?: Node;
  };

  type ToggleNodeStatusReply = {
    code?: number;
    message?: string;
    data?: ToggleNodeStatusData;
  };

  type ToggleNodeStatusRequest = {
    id?: string;
    enable?: boolean;
  };

  type ToggleRedemptionCodeStatusData = {
    success?: boolean;
  };

  type ToggleRedemptionCodeStatusReply = {
    code?: number;
    message?: string;
    data?: ToggleRedemptionCodeStatusData;
  };

  type ToggleRedemptionCodeStatusRequest = {
    id?: string;
    status?: number;
  };

  type ToggleUserSubscribeStatusReply = {
    code?: number;
    message?: string;
  };

  type ToggleUserSubscribeStatusRequest = {
    userSubscribeId?: string;
  };

  type ToolQueryIPLocationParams = {
    ip?: string;
  };

  type TosConfig = {
    tosContent?: string;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLimit = {
    statType?: string;
    statValue?: string;
    trafficUsage?: string;
    speedLimit?: number;
  };

  type TrafficLog = {
    id?: string;
    serverId?: string;
    userId?: string;
    subscribeId?: string;
    download?: string;
    upload?: string;
    timestamp?: string;
  };

  type TrafficLogDetail = {
    id?: string;
    serverId?: string;
    userId?: string;
    subscribeId?: string;
    download?: string;
    upload?: string;
    timestamp?: string;
  };

  type UnbindDeviceRequest = {
    id?: string;
  };

  type UnbindOAuthRequest = {
    method?: string;
  };

  type UnlockService = {
    id?: string;
    code?: string;
    name?: string;
    category?: string;
    enabled?: boolean;
    serviceJson?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type UnlockServiceData = {
    service?: UnlockService;
  };

  type UnlockServiceListData = {
    list?: UnlockService[];
    total?: number;
  };

  type UnlockServiceReply = {
    code?: number;
    message?: string;
    data?: UnlockServiceData;
  };

  type UnsubscribeRequest = {
    id?: string;
  };

  type UpdateAdsData = {
    ads?: Ads;
  };

  type UpdateAdsReply = {
    code?: number;
    message?: string;
    data?: UpdateAdsData;
  };

  type UpdateAdsRequest = {
    id?: string;
    title?: string;
    type?: string;
    content?: string;
    description?: string;
    targetUrl?: string;
    startTime?: string;
    endTime?: string;
    status?: number;
  };

  type UpdateAnnouncementRequest = {
    id?: string;
    title?: string;
    content?: string;
    show?: boolean;
    pinned?: boolean;
    popup?: boolean;
  };

  type UpdateAuthMethodConfigRequest = {
    id?: string;
    method?: string;
    config?: Record<string, any>;
    enabled?: boolean;
  };

  type UpdateBindEmailRequest = {
    email?: string;
  };

  type UpdateBindMobileRequest = {
    areaCode?: string;
    mobile?: string;
    code?: string;
  };

  type UpdateCouponReply = {
    code?: number;
    message?: string;
  };

  type UpdateCouponRequest = {
    id?: string;
    name?: string;
    code?: string;
    count?: string;
    type?: number;
    discount?: string;
    startTime?: string;
    expireTime?: string;
    userLimit?: string;
    subscribe?: string[];
    usedCount?: string;
    enable?: boolean;
  };

  type UpdateCurrencyConfigData = {
    success?: boolean;
  };

  type UpdateCurrencyConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateCurrencyConfigData;
  };

  type UpdateCurrencyConfigRequest = {
    accessKey?: string;
    currencyUnit?: string;
    currencySymbol?: string;
  };

  type UpdateDnsResolverRequest = {
    resolver?: DnsResolver;
  };

  type UpdateDocumentReply = {
    code?: number;
    message?: string;
  };

  type UpdateDocumentRequest = {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
    show?: boolean;
  };

  type UpdateGroupConfigData = {
    success?: boolean;
  };

  type UpdateGroupConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateGroupConfigData;
  };

  type UpdateGroupConfigRequest = {
    enabled?: boolean;
    mode?: string;
    config?: string;
  };

  type UpdateInviteConfigData = {
    success?: boolean;
  };

  type UpdateInviteConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateInviteConfigData;
  };

  type UpdateInviteConfigRequest = {
    forcedInvite?: boolean;
    referralPercentage?: string;
    onlyFirstPurchase?: boolean;
  };

  type UpdateLogSettingReply = {
    code?: number;
    message?: string;
  };

  type UpdateLogSettingRequest = {
    /** 管理端日志配置更新请求 */
    autoClear?: boolean;
    clearDays?: string;
  };

  type UpdateNodeConfigData = {
    success?: boolean;
  };

  type UpdateNodeConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateNodeConfigData;
  };

  type UpdateNodeConfigRequest = {
    nodeSecret?: string;
    nodePullInterval?: string;
    nodePushInterval?: string;
    trafficReportThreshold?: string;
    ipStrategy?: string;
    dns?: NodeDNS[];
    block?: string[];
    outbound?: NodeOutbound[];
    deviceAdmissionEnabled?: boolean;
    deviceCountMode?: string;
  };

  type UpdateNodeData = {
    node?: Node;
  };

  type UpdateNodeGroupData = {
    success?: boolean;
  };

  type UpdateNodeGroupReply = {
    code?: number;
    message?: string;
    data?: UpdateNodeGroupData;
  };

  type UpdateNodeGroupRequest = {
    id?: string;
    name?: string;
    type?: string;
    description?: string;
    sort?: number;
    forCalculation?: boolean;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: number;
    maxTrafficGbExpired?: string;
    speedLimit?: number;
    minTrafficGb?: string;
    maxTrafficGb?: string;
  };

  type UpdateNodeReply = {
    code?: number;
    message?: string;
    data?: UpdateNodeData;
  };

  type UpdateNodeRequest = {
    id?: string;
    name?: string;
    tags?: string[];
    port?: number;
    address?: string;
    serverId?: string;
    protocol?: string;
    enabled?: boolean;
    nodeType?: string;
    isHidden?: boolean;
    nodeGroupIds?: string[];
  };

  type UpdateOrderStatusReply = {
    code?: number;
    message?: string;
  };

  type UpdateOrderStatusRequest = {
    id?: string;
    status?: number;
    paymentId?: string;
    tradeNo?: string;
  };

  type UpdatePaymentMethodReply = {
    code?: number;
    message?: string;
    data?: PaymentConfig;
  };

  type UpdatePaymentMethodRequest = {
    id?: string;
    name?: string;
    platform?: string;
    description?: string;
    icon?: string;
    domain?: string;
    config?: Record<string, any>;
    feeMode?: number;
    feePercent?: string;
    feeAmount?: string;
    sort?: number;
    enable?: boolean;
  };

  type UpdatePrivacyPolicyConfigData = {
    success?: boolean;
  };

  type UpdatePrivacyPolicyConfigReply = {
    code?: number;
    message?: string;
    data?: UpdatePrivacyPolicyConfigData;
  };

  type UpdatePrivacyPolicyConfigRequest = {
    privacyPolicy?: string;
  };

  type UpdateRedemptionCodeData = {
    success?: boolean;
  };

  type UpdateRedemptionCodeReply = {
    code?: number;
    message?: string;
    data?: UpdateRedemptionCodeData;
  };

  type UpdateRedemptionCodeRequest = {
    id?: string;
    totalCount?: string;
    subscribePlan?: string;
    unitTime?: string;
    quantity?: number;
    status?: number;
  };

  type UpdateRegisterConfigData = {
    success?: boolean;
  };

  type UpdateRegisterConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateRegisterConfigData;
  };

  type UpdateRegisterConfigRequest = {
    stopRegister?: boolean;
    enableTrial?: boolean;
    trialSubscribe?: string;
    trialTime?: string;
    trialTimeUnit?: string;
    enableIpRegisterLimit?: boolean;
    ipRegisterLimit?: string;
    ipRegisterLimitDuration?: string;
    deviceLimit?: string;
  };

  type UpdateRouteOutboundRequest = {
    outbound?: RouteOutbound;
  };

  type UpdateRouteProfileRequest = {
    profile?: RouteProfile;
  };

  type UpdateRouteRuleRequest = {
    rule?: RouteRule;
  };

  type UpdateServerData = {
    server?: Server;
  };

  type UpdateServerReply = {
    code?: number;
    message?: string;
    data?: UpdateServerData;
  };

  type UpdateServerRequest = {
    id?: string;
    name?: string;
    country?: string;
    city?: string;
    address?: string;
    sort?: number;
    protocols?: Protocol[];
  };

  type UpdateSiteConfigData = {
    success?: boolean;
  };

  type UpdateSiteConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateSiteConfigData;
  };

  type UpdateSiteConfigRequest = {
    host?: string;
    siteName?: string;
    siteDesc?: string;
    siteLogo?: string;
    keywords?: string;
    customHtml?: string;
    customData?: string;
  };

  type UpdateSubscribeApplicationRequest = {
    id?: string;
    name?: string;
    icon?: string;
    description?: string;
    scheme?: string;
    userAgent?: string;
    isDefault?: boolean;
    template?: string;
    outputFormat?: string;
    downloadLink?: DownloadLink;
  };

  type UpdateSubscribeCategoryData = {
    success?: boolean;
  };

  type UpdateSubscribeCategoryReply = {
    code?: number;
    message?: string;
    data?: UpdateSubscribeCategoryData;
  };

  type UpdateSubscribeCategoryRequest = {
    id?: string | number;
    parentId?: string | number;
    parent_id?: string | number;
    name?: string;
    description?: string;
    language?: string;
    show?: boolean;
    sort?: number;
  };

  type UpdateSubscribeConfigData = {
    success?: boolean;
  };

  type UpdateSubscribeConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateSubscribeConfigData;
  };

  type UpdateSubscribeConfigRequest = {
    singleModel?: boolean;
    subscribePath?: string;
    subscribeDomain?: string;
    panDomain?: boolean;
    userAgentLimit?: boolean;
    userAgentList?: string;
  };

  type UpdateSubscribeData = {
    success?: boolean;
  };

  type UpdateSubscribeGroupData = {
    success?: boolean;
  };

  type UpdateSubscribeGroupReply = {
    code?: number;
    message?: string;
    data?: UpdateSubscribeGroupData;
  };

  type UpdateSubscribeGroupRequest = {
    id?: string;
    name?: string;
    description?: string;
    isExpiredGroup?: boolean;
    expiredDaysLimit?: string;
    maxTrafficGbExpired?: string;
    speedLimit?: number;
  };

  type UpdateSubscribeReply = {
    code?: number;
    message?: string;
    data?: UpdateSubscribeData;
  };

  type UpdateSubscribeRequest = {
    id?: string;
    name?: string;
    language?: string;
    description?: string;
    unitPrice?: string;
    unitTime?: string;
    discount?: SubscribeDiscount[];
    replacement?: string;
    inventory?: number;
    traffic?: string;
    speedLimit?: number;
    deviceLimit?: number;
    quota?: number;
    categoryId?: string;
    nodes?: string[];
    nodeTags?: string[];
    nodeGroupIds?: string[];
    nodeGroupId?: string;
    trafficLimit?: TrafficLimit[];
    show?: boolean;
    sell?: boolean;
    sort?: number;
    deductionRatio?: number;
    allowDeduction?: boolean;
    resetCycle?: number;
    renewalReset?: boolean;
    showOriginalPrice?: boolean;
    priceOptions?: SubscribePriceOption[];
  };

  type UpdateTicketStatusReply = {
    code?: number;
    message?: string;
  };

  type UpdateTicketStatusRequest = {
    id?: string;
    status?: number;
  };

  type UpdateTosConfigData = {
    success?: boolean;
  };

  type UpdateTosConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateTosConfigData;
  };

  type UpdateTosConfigRequest = {
    tosContent?: string;
  };

  type UpdateUnlockServiceRequest = {
    service?: UnlockService;
  };

  type UpdateUserAuthMethodData = {
    success?: boolean;
  };

  type UpdateUserAuthMethodReply = {
    code?: number;
    message?: string;
    data?: UpdateUserAuthMethodData;
  };

  type UpdateUserAuthMethodRequest = {
    userId?: string;
    authType?: string;
    authIdentifier?: string;
  };

  type UpdateUserBasicInfoReply = {
    code?: number;
    message?: string;
  };

  type UpdateUserBasicInfoRequest = {
    userId?: string;
    password?: string;
    avatar?: string;
    balance?: string;
    commission?: string;
    referralPercentage?: number;
    onlyFirstPurchase?: boolean;
    giftAmount?: string;
    telegram?: string;
    referCode?: string;
    refererId?: string;
    enable?: boolean;
    isAdmin?: boolean;
  };

  type UpdateUserDeviceData = {
    success?: boolean;
  };

  type UpdateUserDeviceReply = {
    code?: number;
    message?: string;
    data?: UpdateUserDeviceData;
  };

  type UpdateUserDeviceRequest = {
    id?: string;
    ip?: string;
    identifier?: string;
    userAgent?: string;
    online?: boolean;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type UpdateUserNotifySettingsReply = {
    code?: number;
    message?: string;
  };

  type UpdateUserNotifySettingsRequest = {
    userId?: string;
    enableBalanceNotify?: boolean;
    enableLoginNotify?: boolean;
    enableSubscribeNotify?: boolean;
    enableTradeNotify?: boolean;
  };

  type UpdateUserRulesRequest = {
    rules?: string[];
  };

  type UpdateUserSubscribeNoteRequest = {
    userSubscribeId?: string;
    note?: string;
  };

  type UpdateUserSubscribeReply = {
    code?: number;
    message?: string;
  };

  type UpdateUserSubscribeRequest = {
    userSubscribeId?: string;
    subscribeId?: string;
    traffic?: string;
    expiredAt?: string;
    upload?: string;
    download?: string;
  };

  type UpdateUserTicketStatusRequest = {
    id?: string;
    status?: number;
  };

  type UpdateVerifyCodeConfigData = {
    success?: boolean;
  };

  type UpdateVerifyCodeConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateVerifyCodeConfigData;
  };

  type UpdateVerifyCodeConfigRequest = {
    verifyCodeExpireTime?: string;
    verifyCodeLimit?: string;
    verifyCodeInterval?: string;
  };

  type UpdateVerifyConfigData = {
    success?: boolean;
  };

  type UpdateVerifyConfigReply = {
    code?: number;
    message?: string;
    data?: UpdateVerifyConfigData;
  };

  type UpdateVerifyConfigRequest = {
    turnstileSiteKey?: string;
    turnstileSecret?: string;
    enableUserLoginCaptcha?: boolean;
    enableUserRegisterCaptcha?: boolean;
    enableUserResetPasswordCaptcha?: boolean;
    captchaType?: string;
    enableAdminLoginCaptcha?: boolean;
  };

  type User = {
    id?: string;
    avatar?: string;
    balance?: string;
    referCode?: string;
    refererId?: string;
    commission?: string;
    referralPercentage?: number;
    onlyFirstPurchase?: boolean;
    giftAmount?: string;
    enable?: boolean;
    isAdmin?: boolean;
    enableBalanceNotify?: boolean;
    enableLoginNotify?: boolean;
    enableSubscribeNotify?: boolean;
    enableTradeNotify?: boolean;
    authMethods?: UserAuthMethod[];
    userDevices?: UserDevice[];
    rules?: string[];
    createdAt?: string;
    updatedAt?: string;
    telegram?: string;
    deletedAt?: string;
    isDel?: boolean;
  };

  type User = {
    id?: string;
    avatar?: string;
    balance?: string;
    commission?: string;
    referralPercentage?: number;
    onlyFirstPurchase?: boolean;
    giftAmount?: string;
    telegram?: string;
    referCode?: string;
    refererId?: string;
    enable?: boolean;
    isAdmin?: boolean;
    enableBalanceNotify?: boolean;
    enableLoginNotify?: boolean;
    enableSubscribeNotify?: boolean;
    enableTradeNotify?: boolean;
    authMethods?: UserAuthMethod[];
    userDevices?: UserDevice[];
    rules?: string[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    isDel?: boolean;
  };

  type UserAffiliate = {
    avatar?: string;
    identifier?: string;
    registeredAt?: string;
    enable?: boolean;
  };

  type UserAuthMethod = {
    authType?: string;
    authIdentifier?: string;
    verified?: boolean;
  };

  type UserAuthMethod = {
    authType?: string;
    authIdentifier?: string;
    verified?: boolean;
  };

  type UserAuthMethodServiceDeleteUserAuthMethodParams = {
    userId?: string;
    authType?: string;
  };

  type UserAuthMethodServiceGetUserAuthMethodParams = {
    userId?: string;
  };

  type UserDevice = {
    id?: string;
    ip?: string;
    identifier?: string;
    userAgent?: string;
    online?: boolean;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserDevice = {
    id?: string;
    ip?: string;
    identifier?: string;
    userAgent?: string;
    online?: boolean;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserDeviceServiceDeleteUserDeviceParams = {
    id?: string;
  };

  type UserLoginLog = {
    id?: string;
    userId?: string;
    loginIp?: string;
    userAgent?: string;
    success?: boolean;
    timestamp?: string;
  };

  type UserLoginReply = {
    userId?: string;
    token?: string;
    email?: string;
  };

  type UserLoginRequest = {
    email?: string;
    password?: string;
  };

  type UserLoginRequest = {
    email?: string;
    password?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type UserRegisterReply = {
    userId?: string;
    token?: string;
    email?: string;
  };

  type UserRegisterRequest = {
    email?: string;
    password?: string;
  };

  type UserRegisterRequest = {
    email?: string;
    password?: string;
    invite?: string;
    code?: string;
    cfToken?: string;
    ip?: string;
    userAgent?: string;
    identifier?: string;
    loginType?: string;
    captchaId?: string;
    captchaCode?: string;
    sliderToken?: string;
  };

  type UserServiceBatchDeleteUserParams = {
    ids?: string[];
  };

  type UserServiceDeleteUserParams = {
    id?: string;
  };

  type UserServiceGetUserDetailParams = {
    id?: string;
  };

  type UserServiceGetUserListParams = {
    page?: number;
    size?: number;
    search?: string;
    userId?: string;
    unscoped?: boolean;
    subscribeId?: string;
    userSubscribeId?: string;
    shortCode?: string;
  };

  type UserServiceGetUserLoginLogsParams = {
    page?: number;
    size?: number;
    userId?: string;
  };

  type UserStatistics = {
    date?: string;
    register?: string;
    newOrderUsers?: string;
    renewalOrderUsers?: string;
    list?: UserStatistics[];
  };

  type UserSubscribe = {
    id?: string;
    idStr?: string;
    userId?: string;
    orderId?: string;
    subscribeId?: string;
    subscribe?: Subscribe;
    nodeGroupId?: string;
    groupLocked?: boolean;
    startTime?: string;
    expireTime?: string;
    finishedAt?: string;
    resetTime?: string;
    traffic?: string;
    download?: string;
    upload?: string;
    token?: string;
    status?: number;
    short?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserSubscribe = {
    id?: string;
    userId?: string;
    orderId?: string;
    subscribeId?: string;
    subscribe?: Subscribe;
    startTime?: string;
    expireTime?: string;
    finishedAt?: string;
    resetTime?: string;
    traffic?: string;
    download?: string;
    upload?: string;
    token?: string;
    status?: number;
    short?: string;
    nodeGroupId?: string;
    groupLocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserSubscribeDetail = {
    id?: string;
    userId?: string;
    user?: User;
    orderId?: string;
    subscribeId?: string;
    subscribe?: Subscribe;
    nodeGroupId?: string;
    groupLocked?: boolean;
    startTime?: string;
    expireTime?: string;
    resetTime?: string;
    traffic?: string;
    download?: string;
    upload?: string;
    token?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type UserSubscribeInfo = {
    id?: string;
    userId?: string;
    orderId?: string;
    subscribeId?: string;
    startTime?: string;
    expireTime?: string;
    finishedAt?: string;
    resetTime?: string;
    traffic?: string;
    download?: string;
    upload?: string;
    token?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
    isTryOut?: boolean;
    nodes?: UserSubscribeNodeInfo[];
  };

  type UserSubscribeLog = {
    id?: string;
    userId?: string;
    userSubscribeId?: string;
    token?: string;
    ip?: string;
    userAgent?: string;
    timestamp?: string;
  };

  type UserSubscribeLog = {
    id?: string;
    userId?: string;
    userSubscribeId?: string;
    token?: string;
    ip?: string;
    userAgent?: string;
    timestamp?: string;
  };

  type UserSubscribeNodeInfo = {
    id?: string;
    name?: string;
    uuid?: string;
    protocol?: string;
    protocols?: string;
    port?: number;
    address?: string;
    tags?: string[];
    country?: string;
    city?: string;
    longitude?: string;
    latitude?: string;
    latitudeCenter?: string;
    longitudeCenter?: string;
    createdAt?: string;
    sni?: string;
    /** OmniFlow 基础配置 */
    omniflowCarrier?: string;
    omniflowPath?: string;
    omniflowContentType?: string;
    omniflowProfileJson?: string;
    omniflowCaCertPath?: string;
    omniflowTargetMeta?: string;
    omniflowSpkiPin?: string;
    /** OmniFlow 抗指纹 */
    omniflowAdaptiveTlsEnabled?: boolean;
    omniflowTlsFingerprint?: string;
    omniflowSniMode?: string;
    omniflowPaddingMode?: string;
    /** OmniFlow 随机 AF path */
    omniflowAfEnabled?: boolean;
    omniflowAfPathMode?: string;
    omniflowAfPathPrefix?: string;
    omniflowAfPathSuffix?: string;
    omniflowAfPathRotationSecs?: number;
    omniflowAfPathSkewSlots?: number;
  };

  type UserSubscribeServiceDeleteUserSubscribeParams = {
    userSubscribeId?: string;
  };

  type UserSubscribeServiceGetUserSubscribeByIdParams = {
    id?: string;
  };

  type UserSubscribeServiceGetUserSubscribeDevicesParams = {
    page?: number;
    size?: number;
    userId?: string;
    subscribeId?: string;
  };

  type UserSubscribeServiceGetUserSubscribeLogsParams = {
    page?: number;
    size?: number;
    userId?: string;
    subscribeId?: string;
    userSubscribeId?: string;
    date?: string;
  };

  type UserSubscribeServiceGetUserSubscribeParams = {
    page?: number;
    size?: number;
    userId?: string;
  };

  type UserSubscribeServiceGetUserSubscribeResetTrafficLogsParams = {
    page?: number;
    size?: number;
    userSubscribeId?: string;
    date?: string;
  };

  type UserSubscribeServiceGetUserSubscribeTrafficLogsParams = {
    page?: number;
    size?: number;
    userId?: string;
    subscribeId?: string;
    startTime?: string;
    endTime?: string;
    userSubscribeId?: string;
    date?: string;
  };

  type UserSubscribeTrafficLog = {
    subscribeId?: string;
    userId?: string;
    upload?: string;
    download?: string;
    total?: number;
    date?: string;
    details?: boolean;
  };

  type UserTraffic = {
    sid?: string;
    upload?: string;
    download?: string;
  };

  type UserTrafficData = {
    sid?: string;
    upload?: string;
    download?: string;
  };

  type Value = Record<string, any>;

  type VerifyCodeConfig = {
    verifyCodeExpireTime?: string;
    verifyCodeLimit?: string;
    verifyCodeInterval?: string;
  };

  type VerifyConfig = {
    turnstileSiteKey?: string;
    turnstileSecret?: string;
    enableUserLoginCaptcha?: boolean;
    enableUserRegisterCaptcha?: boolean;
    enableUserResetPasswordCaptcha?: boolean;
    captchaType?: string;
    enableAdminLoginCaptcha?: boolean;
  };

  type VerifyConfig = {
    captchaType?: string;
    turnstileSiteKey?: string;
    enableUserLoginCaptcha?: boolean;
    enableUserRegisterCaptcha?: boolean;
    enableAdminLoginCaptcha?: boolean;
    enableUserResetPasswordCaptcha?: boolean;
  };

  type VerifyEmailRequest = {
    email?: string;
    code?: string;
  };

  type VerifySliderCaptchaReply = {
    token?: string;
  };

  type VerifySliderCaptchaRequest = {
    id?: string;
    x?: number;
    y?: number;
    trail?: string;
  };

  type VersionResponse = {
    version?: string;
  };

  type WeeklyStat = {
    day?: number;
    dayName?: string;
    hours?: number;
  };

  type WithdrawalLog = {
    id?: string;
    userId?: string;
    amount?: string;
    content?: string;
    status?: number;
    reason?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
