import React from "react";

import {
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@material-ui/core";

// import icon
import GitHubIcon from "@material-ui/icons/GitHub";

import SettingStartSchoolButton from "../SettingStartSchoolButton/SettingStartSchoolButton";
import FetchCurriculumButtom from "../FetchCurriculumButtom/FetchCurriculumButtom";

// import const data
import constData from "../../Data/const";
import HistoryButton from "../HistoryButton/HistoryButton";

const ExternalClassroomSelector = ({ currentClassroom, onChange }) => (
  <RadioGroup
    aria-label="Classrooms"
    style={{ flexDirection: "row" }}
    name="classrooms"
    value={currentClassroom}
    onChange={onChange}
  >
    {constData.classroomIndex.map((classroom, index) => {
      return (
        <FormControlLabel
          value={classroom}
          control={<Radio />}
          label={classroom}
          key={index}
        />
      );
    })}
  </RadioGroup>
);

function Navbar({
  refresh,
  currentClassroom,
  setCurrentClassroom,
  semesterInfo,
  version,
}) {
  const currentClassroomChange = (e) => {
    let classroom = e.target.value;
    setCurrentClassroom(classroom);
  };

  return (
    <div>
      <Paper style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          columnSpacing={1}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <h3>中興大學資工系教室借用表 {version}</h3>
            </Grid>
            <Grid item>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/mushding/NCHUCse-curriculum"
              >
                <GitHubIcon />
              </a>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} md={8}>
              <ExternalClassroomSelector
                currentClassroom={currentClassroom}
                onChange={currentClassroomChange}
              />
            </Grid>
            <Grid item xs={6} md={4} spacing={2}>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                spacing={1}
              >
                <Grid item>
                  <HistoryButton/>
                </Grid>
                <Grid item>
                  <SettingStartSchoolButton
                    refresh={refresh}
                    semesterInfo={semesterInfo}
                  />
                </Grid>
                <Grid item>
                  <FetchCurriculumButtom
                    refresh={refresh}
                    semesterInfo={semesterInfo}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Navbar;
