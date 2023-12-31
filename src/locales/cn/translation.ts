export const translations = {
    i18nFeature: {
        title: 'i18n國際化和多元化',
        selectLanguage: '選擇語言',
        description:
            '可擴展的應用程序需要支持多種語言，輕鬆添加和支持多種語言。更改以下語言，以查看如何立即更新頁面而不刷新。',
    },
    Blank: {
        title: 'i18n空白頁',
    },
    General: {
        All: '全部',
        Plant: '工厂: {{plantId}}',
        TimeInUnitsLabel: '时间在',
        LayoutLabel: '布局',
        NoData: '沒有要顯示的數據',
    },
    Components: {
        NavNotification: {
            StatusInfo: '通知',
        },
        DashboardFilterPanel: {
            Title: '过滤 器',
            Reset: '重设',
        },
        Search: {
            Placeholder: '搜索',
        },
        UploadPanel: {
            dropzoneText: '將文件放在這裡。',
            Clear: '清除',
            Upload: '上传',
        },
        OverviewCard: {
            AverageTA: '平均 TA',
            FaultsText: '故障',
            CyclesText: '周期',
            MTTRUnitsText: '分钟',
            MTTRText: 'MTTR',
        },
        OperationsForm: {
            AddNew: '添加新的',
            Shift: '班次',
            Break: '休息',
            Time: '時間',
            Date: '日期',
            To: '至',
            Cancel: '取消',
            Add: '添加',
            Hour: '一小时',
            Minutes: '会议记录',
        },
    },
    DashboardPowerBi: { PageTitle: '儀表板電源', Title: '儀表板電源雙頁' },
    Dashboard: { CycleGapTempo: '周期间隙温度', MeasurementTrends: 'Measurement Trends' },
    Filters: {
        // filter labels
        FilterByFaultCodeLabel: '故障代码',
        FilterByStudTypeLabel: '螺柱类型',
        FilterByStudIdLabel: '螺柱 ID',
        FilterByDeviceNameLabel: '设备名称',
        FilterByDeviceTypeLabel: '设备类型',
        FilterByBodyShopLabel: '身体商店',
        FilterByDateLabel: '日期',
        EventTypeLabel: '事件类型',
        LineLabel: '行行',
        WeekLabel: '周',
        FilterByReportThresholdLabel: '报告阈值',
        StationLabel: '站',
        FilterByAnomalyLabel: '异常',
        FilterByAnomalyConfidenceLabel: '信心',
        SelectFilterLabel: '滤镜',
        // filter placeholders
        FilterByFaultCodePlaceholder: '按故障代码进行筛选',
        FilterByStudTypePlaceholder: '按螺柱类型筛选',
        FilterByStudIdPlaceholder: '筛选器由螺柱 ID',
        FilterByDeviceNamePlaceholder: '按设备名称进行筛选',
        FilterByDeviceTypePlaceholder: '按设备类型筛选',
        FilterByBodyShopPlaceholder: '按身体商店过滤',
        FilterByDatePlaceholder: '日期',
        EventTypePlaceholder: '按事件类型筛选',
        FilterByLinePlaceholder: '逐行过滤',
        FilterByWeekPlaceholder: '按周筛选',
        FilterByReportThresholdPlaceholder: '选择报告阈值',
        FilterByStationPlaceholder: '逐站过滤',
        FilterByAnomalyPlaceholder: '按异常进行筛选',
        FilterByAnomalyConfidencePlaceholder: '按信心过滤',
        SelectFilterPlaceholder: '选择',
        Fault: 'Störung',
        Warning: 'Warnung',
    },
    Widgets: {
        NinePanelTable: {
            NoData: '没有数据',
        },
        ProcessLog: {
            Title: '诊断日志',
            SubTitle: '诊断日志',
            AnomalyTypeLabel: '类型',
            AnomalyDeviceLabel: '设备信息',
            AnomalyStationLabel: '站',
            AnomalyListLabel: '异常',
            AnomalyConfidenceLabel: '信心',
            AnomalyTimeLabel: '年华',
            AnomalyFeedbackLabel: '反馈',
        },
        StationAnomaly: {
            Title: '站异常列表',
            SubTitle: '站异常列表',
            NoAnomaly: '没有一个',
            AnomalyFeedbackLabel: '反馈',
            AnomalyMetadataLabel: '元数据',
        },
        EventCodeFrequency: {
            Title: 'Event Code Frequency Widget',
            WidgetTitle: 'Event Code Frequency Widget',
            SubTitle: 'Event Code Frequency Widget',
            FaultFrequencyChartTitle: '事件代碼的頻率',
            YAxisFaultFrequencyTitle: '事件編號的計數',
            XAxisFaultFrequencyTitle: '活動編號',
            Fault: '故障',
            FaultCount: '故障数',
        },
        EventDescFrequency: {
            Title: 'Frequency Event Description Widget',
            WidgetTitle: 'Event Desc Frequency Widget',
            SubTitle: 'EventDescFrequency Widget',
            FaultFrequencyChartTitle: 'Frequencies of Event Description 2021',
            YAxisFaultFrequencyTitle: 'Description',
            XAxisFaultFrequencyTitle: '事件編號的計數',
            Fault: '故障',
        },
        EventCountFrequencyWidget: {
            Title: 'Event Count Frequency widget',
            WidgetTitle: 'EventCountFrequencyWidget Widget',
            SubTitle: 'EventCountFrequencyWidget Widget',
            FaultFrequencyCountTitle: 'Event Code by Week 2021',
            YAxisFaultFrequencyCountTitle: 'Week',
            XAxisFaultFrequencyCountTitle: 'Event Count',
        },
        EventCountDailyFrequency: {
            Title: 'Event Count Frequency widget',
            WidgetTitle: 'EventCountFrequencyWidget Widget',
            SubTitle: 'EventCountFrequencyWidget Widget',
            FaultFrequencyCountTitle: 'Event Code by Day 2021',
            YAxisFaultFrequencyCountTitle: 'Date',
            XAxisFaultFrequencyCountTitle: 'Event Count',
        },
        OpportunityAnalysis: {
            WidgetTitle: '机会分析',
            SubTitle: '机会分析',
            ActionRecommended: '建议的行动',
            ActionTaken: '已采取的行动',
            CaseClosed: '案例已结案',
        },
        EventRateCycleCount: {
            WidgetTitle: 'EventRateCycleCount Widget',
            SubTitle: 'EventRateCycleCount Widget',
            EventRateCycleCountitle: '循环计数和事件按周百分比',
            YAxisEventRateCycleCountTitle: '週期盤點',
            SecondaryYAxisEventRateCycleCountTitle: `事件發生率`,
            XAxisEventRateCycleCountTitle: '日期',
        },
        EventRatePerEvent: {
            WidgetTitle: 'EventRatePerEvent Widget',
            SubTitle: 'EventRatePerEvent Widget',
            Fault: 'Fault',
            Warning: 'Warning',
        },
        EventRatePerDevice: {
            WidgetTitle: 'EventRatePerDevice Widget',
            SubTitle: 'EventRatePerDevice Widget',
            EventRatePerDeviceTitle: '每天每台設備的事件發生率 2021',
            EventRatePerBodyshopTitle: '活动费率为',
            EventRateByDay: '按天',
            EventRateByWeek: '按周',
            YAxisEventRatePerDeviceTitle: '事件发生率（百万分之几',
            XAxisEventRatePerDeviceTitle: 'Date',
        },
        Lift: {
            WidgetTitle: '抬升',
            SubTitle: '抬升',
            YAxisTitle: '抬升 (mm)',
            Maximum: '最大',
            Minimum: '最小',
            Actual: '現實',
        },
        Penetration: {
            WidgetTitle: `滲透`,
            SubTitle: `滲透`,
            YAxisTitle: '滲透 (mm)',
            Maximum: '最大',
            Minimum: '最小',
            Actual: '現實',
        },
        Voltage: {
            WidgetTitle: '電壓',
            SubTitle: '電壓',
            YAxisTitle: '電壓 (V)',
            Maximum: '最大',
            Minimum: '最小',
            Actual: '現實',
        },
        WeldTime: {
            WidgetTitle: '焊接時間',
            SubTitle: '焊接時間',
            YAxisTitle: 'Temps (ms)',
            Maximum: '最大',
            Minimum: '最小',
            Actual: '現實',
        },
        DurationOfFaults: {
            WidgetTitle: '事件代碼的持續時間',
            Fault: '故障',
            xAxisLabel: '活動編號',
            yAxisLabel: '持續時間 事件編號',
        },
        TaAnalysisTable: {
            WidgetTitle: 'TA分析表',
            SubTitle: 'TA分析表',
            TableDeviceName: '设备名称 输出/故障代码',
            TableTitle: 'TA为设备名称和输出',
        },
        MtbfAnalysisTable: {
            WidgetTitle: 'MtbfAnalysisTable Widget',
            SubTitle: 'MtbfAnalysisTable Widget',
            TableDeviceName: `设备名称 输出/故障代码`,
            TableTitle: `故障发生的平均间隔时间`,
        },
    },
    HomePage: {
        PageTitle: '主頁',
        Title: '主頁',
        Last_Updated: '最后更新',
        Risk: '风险',
        Target: '目标',
        TechnicalAvail: 'TA',
        FaultTrend: '断层趋势',
    },
    SignIn: {
        PageTitle: '登錄',
        Title: '登錄',
        Email: {
            Placeholder: '電子郵件',
        },
        Password: {
            Placeholder: '密碼',
        },
        LoggedIn: '保持登錄狀態',
        LoginButton: {
            Label: '登錄',
            Loading: '載入中...',
        },
        ForgetUsernameOrPassword: '忘記用戶名 / 密碼',
        NewUser: '新用戶',
        Error: {
            ValidEmailRequired: '必填：請提供有效的電子郵件地址。',
            ValidPasswordRequired: '必填：請提供一個有效的密碼。',
        },
    },
    NavProfile: {
        UserAvatarAltMessage: '用戶頭像',
    },
    PanelScreenPage: {
        PageTitle: '项目',
        Title: '進度概覽',
    },
    ProjectsPage: {
        PageTitle: '项目',
        Title: '進度概覽',
    },
    ReportingViewPage: {
        PageTitle: '根本原因分析',
        Title: '根本原因分析',
        Table: {
            StudType: '螺柱類型',
            DeviceName: '設備名稱',
            StudId: '螺柱 ID',
        },
        DatePicker: {
            ANNUALLY: '[年] YYYY',
            WEEKLY: '[星期] W',
            DAILY: 'ddd',
            HOURLY: 'YYYYMMDD HH:MM:ss',
        },
        FileUpload: '上傳文件',
        ExportToExcel: '導出到eXcel',
        ExportToPdf: '導出為PDF',
        FaultAssignment: '故障映射',
        FaultAssignmentVal: '(多個要素)',
        StatusB: '地位 B',
        StatusBVal: '空的',
        Event: '事件',
        EventVal: '故障',
        SelectFaultCode: 'Select 故障 #:',
        FilterByFaultCode: 'Filter By  螺柱類型:',
        FilterByStudType: 'Filter By 螺柱類型',
        FilterByDeviceName: 'Filter By 設備',
        FilterByStudID: 'Filter By 螺柱 ID',
        RecommendedActionTitle: '動作',
        InformationPlaceholder: '信息標題佔位符',
        AddCommentsTitle: '添加評論（可選):',
        AddCommentsBtn: '提交',
        History: '歷史',
        Close: '關閉',
        filterBy: '過濾',
        ParentLabelPage: {
            Year: '年',
            Week: '星期',
            Day: '日',
            Hour: '小時',
        },
        NoData: '沒有要顯示的數據',
    },
    ReportingViewPageB: {
        PageTitle: 'Hubert 報表檢視',
        Title: 'Hubert 報表檢視',
        Table: {
            Fault: '故障',
            Description: '描寫',
        },
        FileUpload: '上傳文件',
        ExportToExcel: '導出到eXcel',
        ExportToPdf: '導出到PDF',
        FaultAssignment: '故障映射',
        FaultAssignmentVal: '(多個要素)',
        StatusB: '地位 B',
        StatusBVal: '空的',
        Event: '事件',
        EventVal: '故障',
        SelectFaultCode: 'Select 故障 #:',
        FilterByStudType: 'Filter By 螺柱類型',
        FilterByDeviceName: 'Filter By 設備',
        FilterByStudID: 'Filter By 螺柱 ID',
        WeekDay: '平日',
        All: '全部',
        DeviceName: '設備名稱',
        ThresholdRedMarkingNote: ' {{threshold}} 次錯誤',
        StudType: '螺柱類型',
        OverAllResult: '總結果',
        Sunday: '星期日',
        Monday: '週一',
        Tuesday: '週二',
        Wednesday: '週三',
        Thursday: '週四',
        Friday: '星期五',
        Saturday: '週六',
        Fault: '故障',
        Info: '信息',
        ComponentExchange: '組件交換',
        FirmwareUpdate: '固件升級',
        Maintainance: '維修保養',
        Active: '激活',
        // Events: '故障,信息,組件交換,固件升級,維修保養,積極的',
        Events: '故障',
        Year: '年',
        Week: '星期',
        PDFTitle: `每日錯誤報告`,
        PDFFileName: '錯誤報告',
    },
    SummaryDashboard: {
        PageTitle: '摘要儀表板',
        Title: '摘要儀錶盤一覽',
    },
    PlantLevelKpi: {
        PageTitle: '工厂 KPI',
        Title: '工廠KPI概述',
    },
    LabAnalysis: {
        PageTitle: '實驗室數據KPI',
        Title: '實驗室數據KPI',
    },
    Sidebar: {
        PageTitle: 'Seitenleiste',
        Title: 'Seitenleiste Seite',
        NinePanel: '九個面板',
        Home: '主頁',
        Projects: '项目',
        ReportingView: '報告檢視',
        ReportingViewB: '報告檢視 B',
        SummaryDashboard: '摘要儀表板',
        PlantKPI: '工厂 KPI',
        Analytics: '分析学',
        LabAnalysis: '分析',
        DashboardKPIs: '儀錶盤 KPIs',
        FileUpload: '上傳文件',
        Api: 'ELU API',
        Logout: '登出',
    },
    FileUpload: {
        PageTitle: '上傳文件',
        Title: '文件上傳頁面',
        DropzoneText: '刪除要上傳的文件',
        UploadCyclesLabel: '上传监测/ 周期 XML',
        UploadSytemEventsLabel: '上传系统事件XML',
        UploadMaintenanceLabel: '維護XML上傳',
        Back: '後退',
        Finish: '完成',
    },
    SystemOverview: {
        PageTitle: `舰队概述`,
        Title: `舰队概述`,
        TableColumnFault: `設備名稱 / Outlet`,
    },
    PlantOverview: {
        PageTitle: '工廠概況',
        Title: '工廠概況',
        NavBarTitle: '应用',
        MaintenanceTitle: '維修分析',
        MaintenanceSubTitle: '維修分析',
        SystemTitle: '舰队概述',
        SystemSubTitle: '系統健康',
        UploadTitle: '上传',
        UploadSubTitle: '上傳文件',
        SystemHealthCard: '系統健康卡',
        Week: '星期',
        Change: '改變',
        New: '新的',
        NoChange: '无变化',
        FaultFrequencyChartTitle: '事件代码前 {{topX}} 个频率',
        FaultByOccurrence: '发生率最高的前 {{topX}} 个故障',
        FaultByDuration: '持续时间最长的前 {{topX}} 个故障',
        SystemWithFaults: '故障发生率最高的前 {{topX}} 台设备',
        StudTypeWithFaults: '故障发生率最高的前 {{topX}} 种螺柱类型',
        DeviceByDuration: '持续时间最长的前 {{topX}}个设备',

        Fault: '故障',
        Occurrences: '發生次數',
        Position: '位置',
        System: '系統',
        StudType: '螺柱類型',
        YAxisFaultFrequencyTitle: '事件數計數',
        XAxisFaultFrequencyTitle: '活動編號',
        TotalCyclesTooltip: '在周',
        PreviousDay: '前一天',
        PreviousWeek: '上个星期',
        TotalCycles: '每週循環計數',
        TechnicalAvailability: '技術可用性',
        MeanTimeToRepair: '平均維修時間',
        MeanTimeBetweenFailure: '平均故障間隔時間',
        MeanTimeToFailure: '平均故障時間',
        Ratio: '比率',
        Cycle: '週期數',
    },
    ProcessLogView: { PageTitle: '诊断日志', Title: '诊断日志', BtnBarDateFilter: '历史' },
    ParetoAnalysis: {
        PageTitle: '	',
        Title: '帕累托分析 ',
        EventDescriptionChartTitle: '活動描述的頻率',
        EventDescriptionChartXAxisLabel: '事件數計數',
        EventDescriptionChartYAxisLabel: '描述',
        EventCodeChartTitle: '事件代碼的頻率',
        EventCodeChartXAxisLabel: '活動編號',
        EventCodeChartYAxisLabel: '事件數計數',
        EventCodeChartSecondaryYAxisLabel: '百分比',
    },
    FailureRateTrend: {
        PageTitle: '失效率趋势',
        Title: '失效率趋势',
        EventRatePerEventChartTitle: '每週每個事件編號的事件發生率 2021',
        EventRatePerEventXAxisLabel: 'Week',
        EventRatePerEventYAxisLabel: '事件发生率（百万分之几',
    },
    FaultCountTrend: { PageTitle: '故障計數趨勢', Title: '故障計數趨勢' },
    OpportunityAnalysis: { PageTitle: '機會分析', Title: '機會分析 ' },
    RootCauseVisibility: { PageTitle: 'Root Cause Visibility', Title: 'Root Cause Visibility ' },
    EssentialControlChart: { PageTitle: '基本控製圖', Title: '基本控製圖 ' },
    MtbfAnalysis: { PageTitle: '平均故障间隔时间分析', Title: '平均故障间隔时间分析' },
    MttrAnalysis: { PageTitle: 'Mean Time To Repair Analysis', Title: 'Mean Time To Repair Analysis ' },
    TaAnalysis: { PageTitle: '技术可用性分析', Title: '技术可用性分析' },
    EventOccurrence: { PageTitle: 'Event Occurrence', Title: 'Event Occurrence ' },
    TopXFaultCountAnalysis: { PageTitle: 'Top Faults Per AFO', Title: 'Top Faults Per AFO' },
    FaultRateForecast: { PageTitle: 'Fault Rate Forecast', Title: 'Fault Rate Forecast ' },
    CarBodyAnalysis: { PageTitle: '车身分析', Title: '车身分析' },
    SettingsPage: {
        PageTitle: '设置',
        Operation: '业务/操作',
        AddNew: '添加新的',
        Shifts: '班级',
        Breaks: '休息',
        ShiftName: '轮班名称',
        BreakName: '休息时间名称',
        TimeFrom: '时间从',
        TimeTo: '时间到了',
        DateFrom: '日期从',
        DateTo: '日期至',
        Delete: '删除',
        Edit: '编辑',
        Actions: '行动',
    },
    // [INSERT NEW COMPONENT EN TITLE KEY ABOVE] < Needed for generating containers language seamlessly
};

export default translations;
