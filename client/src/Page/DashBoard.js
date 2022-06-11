import React, { useState, useEffect } from "react";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
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
} from "@devexpress/dx-react-scheduler-material-ui";
import { withStyles } from "@material-ui/core/styles";

// import icon
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

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
  const [curriculums, setCurriculums] = useState([]);
  const [currentClassroom, setCurrentClassroom] = useState("821");
  const [semesterInfo, setSemesterInfo] = useState({});

  const [version, setVersion] = useState("v3.04 Beta");

  useEffect(() => {
    initData();
  }, [currentClassroom]);

  const initData = async () => {
    try {
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
      const info = {
        ...jsonData,
        year: jsonData["semester_year"],
        type:
          today <= summerDate.setDate(summerDate.getDate() + 18 * 7)
            ? "1"
            : "2",
      };

      // getBackendCurriculumData part
      let res = await fetch(
        `/api/getWebsite/${currentClassroom}/${info["year"]}/${info["type"]}`
      );
      let data = await res.json();
      res = await fetch(
        `/api/getStatic/${currentClassroom}/${info["year"]}/${info["type"]}`
      );
      data.push(...(await res.json()));
      res = await fetch(
        `/api/getTemporary/${currentClassroom}/${info["year"]}/${info["type"]}`
      );
      data.push(...(await res.json()));

      // add id
      data.forEach((data, index) => (data["id"] = index));

      // init setState part (only call ones)
      setSemesterInfo(info);

      // clear curriculums prevData won't correctly...
      // why...?
      setCurriculums([]);
      setCurriculums(data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateNCHUWebsiteData = async () => {
    try {
      await fetch("/api/updateCseWebsite");
    } catch (e) {
      console.log(e);
    }
  };

  const magicRefreshPage = () => {
    // magic way to trigger useEffect...
    const refresh = currentClassroom;
    setCurrentClassroom("0");
    setCurrentClassroom(refresh);
  };

  const allAddCurriculum = async (added) => {
    added.startDate = new Date(
      added.startDate.getTime() - added.startDate.getTimezoneOffset() * 60000
    );
    added.endDate = new Date(
      added.endDate.getTime() - added.endDate.getTimezoneOffset() * 60000
    );
    added.classroom = currentClassroom;
    added.semester_year = semesterInfo["year"];
    added.semester_type = semesterInfo["type"];
    // website
    if (added.curriculumType === 1) {
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
    } else if (added.curriculumType === 2) {
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
    } else if (added.curriculumType === 3) {
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
    magicRefreshPage();
  };

  const staticChangeCurriculum = async (target) => {
    target.startDate = new Date(
      target.startDate.getTime() - target.startDate.getTimezoneOffset() * 60000
    );
    target.endDate = new Date(
      target.endDate.getTime() - target.endDate.getTimezoneOffset() * 60000
    );
    target.classroom = currentClassroom;
    target.semester_year = semesterInfo["year"];
    target.semester_type = semesterInfo["type"];
    target.title = target.title.split("\n")[0];
    await fetch("/api/updateStatic", {
      method: "POST",
      body: JSON.stringify(target),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    magicRefreshPage();
  };

  const staticDeleteCurriculum = async (target) => {
    const data = {
      id: target.pkId,
    };
    await fetch("/api/dropStatic", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    magicRefreshPage();
  };

  const temporaryChangeCurriculum = async (target) => {
    target.startDate = new Date(
      new Date(target.startDate).getTime() -
        new Date(target.startDate).getTimezoneOffset() * 60000
    );
    target.endDate = new Date(
      new Date(target.endDate).getTime() -
        new Date(target.endDate).getTimezoneOffset() * 60000
    );
    target.classroom = currentClassroom;
    target.semester_year = semesterInfo["year"];
    target.semester_type = semesterInfo["type"];
    target.title = target.title.split("\n")[0];
    await fetch("/api/updateTemporary", {
      method: "POST",
      body: JSON.stringify(target),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    magicRefreshPage();
  };

  const temporaryDeleteCurriculum = async (target) => {
    await fetch("/api/dropTemporary", {
      method: "POST",
      body: JSON.stringify(target),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    magicRefreshPage();
  };

  const commitEditChanges = async ({ added, changed, deleted }) => {
    // temporary
    // change -> (_, array id, change value, _)
    // delete -> (_, _, pkId type)

    // static
    // change -> (complete, array id, _)
    // delete -> (_, array id, change value, _)

    // static, temporary add
    if (added && !changed && !deleted) {
      allAddCurriculum(added);
      // temporary changed or static deleted
    } else if (!added && changed && !deleted) {
      let target_id = Object.keys(changed);
      let target = curriculums[target_id];
      target = {
        ...target,
        ...changed[Object.keys(changed)],
      };
      if (target["curriculumType"] === 2) {
        // static, temporary-repeat deleted
        staticDeleteCurriculum(target);
      } else if (target["curriculumType"] === 3) {
        if ("exDate" in changed[target_id]) {
          // temporary-repeat deleted
          target = {
            id: target["pkId"],
          };
          temporaryDeleteCurriculum(target);
        } else {
          // temporary-solo changed
          temporaryChangeCurriculum(target);
        }
      }
      // temporary-solo delete
    } else if (!added && !changed && deleted) {
      temporaryDeleteCurriculum(deleted);
      // static, temporary-repeat change
    } else if (added && changed && !deleted) {
      let target_id = Object.keys(changed);
      let target = curriculums[target_id];
      target = {
        ...target,
        ...added,
      };
      if (target["curriculumType"] === 2) {
        staticChangeCurriculum(target);
      } else if (target["curriculumType"] === 3) {
        temporaryChangeCurriculum(target);
      }
    }
  };

  return (
    <div>
      <Navbar 
				refresh={magicRefreshPage}
				currentClassroom={currentClassroom}
				setCurrentClassroom={setCurrentClassroom}
				semesterInfo={semesterInfo}
				version={version}
			/>
      <Paper>
        <Scheduler
          data={curriculums}
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
          <IntegratedEditing />
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
