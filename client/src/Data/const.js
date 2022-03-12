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
    "350"
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

const messages = {
    moreInformationLabel: '',
    titleLabel: '借用目的',
    detailsLabel: '借用目的',
    commitCommand: '儲存',
    never: '不重複',
    daily: '以日為單位重複',
    weekly: '以週為單位重複',
    monthly: '以月為單位重複',
    yearly: '以年為單位重複',
    repeatEveryLabel: '以每',
    daysLabel: '(天) 重複',
    endRepeatLabel: '結束重複的條件',
    onLabel: '重複',
    afterLabel: '直到…',
    occurrencesLabel: '幾次',
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

export default {
    classroomIndex,
    resourceData,
    messages
}