import React, { useState, useEffect } from "react";
import {
  ViewState,
  EditingState,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  MonthView,
  ViewSwitcher,
  Appointments,
  AppointmentForm,
  ConfirmationDialog,
  Toolbar,
  DateNavigator,
  TodayButton,
  Resources,
  AppointmentTooltip,
  DragDropProvider,
  EditRecurrenceMenu,
} from "@devexpress/dx-react-scheduler-material-ui";
import { withStyles } from "@material-ui/core/styles";

// import icon
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

// import moment
import moment from 'moment'
import 'moment-timezone'

import {
  Paper,
  Grid,
} from "@material-ui/core";

// import const data
import constData from "../Data/const";

// import Component
import Navbar from "../Component/Navbar/Navbar";
import Footer from "../Component/Footer/Footer";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenterFirst: {
    textAlign: "center",
    padding: "8px",
  },
  textCenter: {
    textAlign: "center",
    padding: "4px",
  },
});

const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      borderRadius: "0px",
      fontSize: "15px",
    }}
  >
    {children}
  </Appointments.Appointment>
);

const Content = withStyles(style, { name: "Content" })(
  ({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <Grid container alignItems="center">
        <Grid item xs={2} className={classes.textCenterFirst}>
          <FormatListNumberedIcon className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <span>ID：{appointmentData.pkId}</span>
        </Grid>
        <Grid item xs={2} className={classes.textCenter}>
          <AlarmAddIcon className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <span>課表新增時間：{appointmentData.addtime}</span>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  )
);

const TextEditor = (props, { ...restProps }) => {
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BooleanEditor = (props, { ...restProps }) => {
  if (props.label === "設定整天") {
    return null;
  }
  return <AppointmentForm.BooleanEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onOfficeChange = (nextValue) => {
    onFieldChange({ office: nextValue });
  };
  return (
    <AppointmentForm.BasicLayout
      appointmentData={
        appointmentData.title
          ? { ...appointmentData, title: appointmentData.title.split("\n")[0] }
          : appointmentData
      }
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <AppointmentForm.Label text="借用單位" type="title" />
      <AppointmentForm.TextEditor
        value={appointmentData.office}
        onValueChange={onOfficeChange}
        placeholder="借用單位"
      />
    </AppointmentForm.BasicLayout>
  );
};

const DashBoard = () => {
  // there are two types of curriculum
  // one for store all curriculum cache
  // one for show at the frontend, filtered by <Navbar> ratio button
  const [semesterInfo, setSemesterInfo] = useState([]);
  const [showedCurriculums, setShowedCurriculums] = useState([]);
  const [allCurriculums, setAllCurriculums] = useState([]);
  const [currentClassroom, setCurrentClassroom] = useState("821");

  // update state to refresh
  const [updateAdding, setUpdateAdding] = useState(true);
  const [updateChangeDelete, setUpdateChangeDelete] = useState(true);

  const [version, setVersion] = useState("v3.2");
  
  useEffect(() => {
    initData();
  }, [updateAdding]);

  useEffect(() => {
    updateWebsite();
  }, [currentClassroom, updateChangeDelete])

  const initData = async () => {
    // initStartOfSchoolDate part
    let response = await fetch("api/getStartSchoolDate");
    let jsonData = await response.json();
    let today = new Date();
    jsonData = jsonData[0];
    let semester_year = parseInt(jsonData["semester_year"]);
    let summerDate = new Date(String(semester_year + 1911));
    let winterDate = new Date(String(semester_year + 1912));
  
    summerDate.setMonth(
      parseInt(jsonData["summer_date_month"]) - 1,
      parseInt(jsonData["summer_date_day"])
    );
    winterDate.setMonth(
      parseInt(jsonData["winter_date_month"]) - 1,
      parseInt(jsonData["winter_date_day"])
    );
  
    // use before end of school to calculate the semester
    // semesterType first is  1, second is 2
    let info =  {
      ...jsonData,
      year: jsonData["semester_year"],
      type:
        today <= summerDate.setDate(summerDate.getDate() + 18 * 7)
          ? "1"
          : "2",
    };
    // getBackendCurriculumData part
    let res = await fetch(
      `/api/getWebsite/${info["year"]}/${info["type"]}`
    );
    let data = await res.json();
    res = await fetch(
      `/api/getStatic/${info["year"]}/${info["type"]}`
    );
    data.push(...(await res.json()));
    res = await fetch(
      `/api/getTemporary/${info["year"]}/${info["type"]}`
    );
    data.push(...(await res.json()));
  
    // add id
    data.forEach((data, index) => (data["id"] = index));
    setAllCurriculums(data);
    let filtered = data.filter(data => data.classroom === currentClassroom);
    setShowedCurriculums(filtered)
    setSemesterInfo(info);
    updateNCHUWebsiteData();
  };

  const updateWebsite = () => {
    filterCurriculums();
  }

  const filterCurriculums = () => {
    let filtered = allCurriculums.filter(data => data.classroom === currentClassroom);
    setShowedCurriculums(filtered);
  };

  const updateNCHUWebsiteData = async () => {
    try {
      await fetch(`/api/updateCseWebsite/${semesterInfo["year"]}/${semesterInfo["type"]}`);
    } catch (e) {
      console.log(e);
    }
  };

  const addRefreshPage = async () => {
    // magic way to trigger useEffect...
    setUpdateAdding(prev => !prev);
  };
  const changeDeleteRefreshPage = async () => {
    // magic way to trigger useEffect...
    setUpdateChangeDelete(prev => !prev);
  };

  const allAddCurriculum = async (added) => {
    added.startDate = moment(added.startDate).format();
    added.endDate = moment(added.endDate).format();
    added.classroom = currentClassroom;
    added.semester_year = semesterInfo["year"];
    added.semester_type = semesterInfo["type"];
    added.title = added.title.split('\n')[0]
    added.id = allCurriculums.length;
    setAllCurriculums(prev => [...prev, added])
    // website
    if (added["curriculumType"] === 1) {
      if (added.title === undefined || added.office === undefined) {
        alert("有資料欄位沒有填入！");
      } else {
        await fetch("/api/addWebsite", {
          method: "POST",
          body: JSON.stringify(added),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
      } // static
    } else if (added["curriculumType"] === 2) {
      if (added.title === undefined || added.office === undefined) {
        alert("有資料欄位沒有填入！");
      } else {
        await fetch("/api/addStatic", {
          method: "POST",
          body: JSON.stringify(added),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
      } // temporary
    } else if (added["curriculumType"] === 3) {
      if (added.title === undefined || added.office === undefined) {
        alert("有資料欄位沒有填入！");
      } else {
        await fetch("/api/addTemporary", {
          method: "POST",
          body: JSON.stringify(added),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
      }
    } else {
      alert("請選擇借用類別！");
    }
    addRefreshPage();
  };

  const allChangeCurriculum = async (target) => {
    target.startDate = moment(target.startDate).format();
    target.endDate = moment(target.endDate).format();
    target.classroom = currentClassroom;
    target.semester_year = semesterInfo["year"];
    target.semester_type = semesterInfo["type"];
    target.rRule = target.rRule ? target.rRule : "";
    target.title = target.title.split("\n")[0] + "\n" + target.office;
    setAllCurriculums(prev => {
      prev[target.id] = target;
      return prev;
    })
    
    if (target["curriculumType"] === 1) {
      await fetch("/api/updateWebsite", {
        method: "POST",
        body: JSON.stringify(target),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    } else if (target["curriculumType"] === 2) {
      await fetch("/api/updateStatic", {
        method: "POST",
        body: JSON.stringify(target),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    } else if (target["curriculumType"] === 3) {
      await fetch("/api/updateTemporary", {
        method: "POST",
        body: JSON.stringify(target),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    }
    changeDeleteRefreshPage();
  }

  const allDeleteCurriculum = async (target) => {   
    setAllCurriculums(prev => {
      prev.splice(target.id, 1);
      return prev;
    })
    const data = {
      id: target.pkId,
    };
    if (target["curriculumType"] === 1) {
      await fetch("/api/dropWebsite", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    } else if (target["curriculumType"] === 2) {
      await fetch("/api/dropStatic", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    } else if (target["curriculumType"] === 3) {
      await fetch("/api/dropTemporary", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    }
    changeDeleteRefreshPage();
  }

  const commitEditChanges = async ({ added, changed, deleted }) => {
    // add
    // add new curriculum, change recurrsive
    // change
    // a dict: {num: Object}
    // delete
    // just int number
    if (added) {
      allAddCurriculum(added);
    }
    if (changed) {
      let target = allCurriculums[Object.keys(changed)];
      let data = {
        ...target,
        ...changed[Object.keys(changed)],
      };
      allChangeCurriculum(data);
    }
    if (deleted) {
      let target = deleted.id ? allCurriculums.find(data => data.pkId === deleted.id) : allCurriculums[deleted];
      allDeleteCurriculum(target);
    }
  };

  return (
    <div>
      <Navbar 
				currentClassroom={currentClassroom}
				setCurrentClassroom={setCurrentClassroom}
				semesterInfo={semesterInfo}
				version={version}
			/>
      <Paper>
        <Scheduler
          data={showedCurriculums}
          // height={screenHeight}
          firstDayOfWeek={1}
          locale={"zh-TW"}
        >
          <ViewState />
          <Toolbar
          // flexibleSpaceComponent={FlexibleSpace}
          />
          <WeekView
            displayName={"以週為單位顯示"}
            startDayHour={8}
            endDayHour={23}
          />
          <MonthView displayName={"以月為單位顯示"} />
          <ViewSwitcher />
          <EditingState onCommitChanges={commitEditChanges} />
          <EditRecurrenceMenu 
            messages={constData.editRecurrenceMenuMessage}
          />
          <ConfirmationDialog messages={constData.confirmationDialogMessage} />
          <DateNavigator />
          <TodayButton />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip
            contentComponent={Content}
            showOpenButton
            showDeleteButton
            showCloseButton
          />
          <Resources data={constData.resourceData} />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            booleanEditorComponent={BooleanEditor}
            messages={constData.appointmentFormMessages}
          />
          <DragDropProvider />
        </Scheduler>
      </Paper>
      <Footer/>
    </div>
  );
};

export default DashBoard;
