const classroomIndex = [
    "802",
    "803",
    "821",
    "1002",
    "1007",
    "1019",
    "1022A",
    "241",
    "242",
    "335",
    "336",
    "337",
    "338",
    "350",
    "318"
]

const resourceData = [
    {
        fieldName: 'curriculumType',
        title: 'CurriculumType',
        instances: [
            { id: 1, text: '網頁課表', color: "#838bb2" },
            { id: 2, text: '固定借用', color: "#e4a99b" },
            { id: 3, text: '臨時借用', color: "#BEC23F" },
        ]
    }
]

// Localization messages

const appointmentFormMessages = {
    moreInformationLabel: '',
    titleLabel: '借用目的',
    detailsLabel: '借用目的',
    commitCommand: '儲存',
    never: '不重複',
    daily: '以日為單位重複',
    weekly: '以週為單位重複',
    monthly: '以月為單位重複',
    yearly: '以年為單位重複',
    repeatEveryLabel: '以每隔',
    daysLabel: '(天) 重複',
    endRepeatLabel: '結束重複的條件',
    repeatLabel: '設定重複',
    allDayLabel: '設定整天',
    onLabel: '總共',
    afterLabel: '直到…',
    occurrencesLabel: '次',
    weeksOnLabel: '(週) 重複',
    monthsLabel: '(月) 重複',
    ofEveryMonthLabel: '號開始重複',
    theLabel: '以禮拜',
    firstLabel: '第一週',
    secondLabel: '第二週',
    thirdLabel: '第三週',
    fourthLabel: '第四週',
    lastLabel: '最後一週',
    yearsLabel: '(年) 重複',
    ofLabel: 'of ',
    everyLabel: '每',
};

const confirmationDialogMessage = {
    discardButton: '捨棄',
    deleteButton: '刪除',
    cancelButton: '取消',
    confirmDeleteMessage: '確定要刪掉這個課表？',
    confirmCancelMessage: '捨棄未儲存的變動？'
};

const editRecurrenceMenuMessage = {
    current: '「就這個」，只修改/刪除目前選取的課表',
    currentAndFollowing: '「從此之後」，修改/刪除從此之後的課表',
    all: '「全部」，修改/刪除全部的課表',
    menuEditingTitle: '修改重複課表選項',
    menuDeletingTitle: '刪除重複課表選項',
    cancelButton: '取消',
    commitButton: '確認'
};

export default {
    classroomIndex,
    resourceData,
    appointmentFormMessages,
    confirmationDialogMessage,
    editRecurrenceMenuMessage
}