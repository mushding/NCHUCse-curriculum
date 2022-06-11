import React from "react";

import {
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

// import icon
import GitHubIcon from "@material-ui/icons/GitHub";

import SettingStartSchoolButton from "../SettingStartSchoolButton/SettingStartSchoolButton";
import FetchCurriculumButtom from "../FetchCurriculumButtom/FetchCurriculumButtom";

// import const data
import constData from "../../Data/const";

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
      <Paper style={{ paddingLeft: "20px" }}>
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
          <Grid item>
            <ExternalClassroomSelector
              currentClassroom={currentClassroom}
              onChange={currentClassroomChange}
            />
          </Grid>
        </Grid>
        <div style={{ padding: "20px", float: "right" }}>
          <SettingStartSchoolButton
            // refresh={getBackendCurriculumData}
            semesterInfo={semesterInfo}
          />
        </div>
        <div style={{ padding: "20px", float: "right" }}>
          <FetchCurriculumButtom
            // refresh={getBackendCurriculumData}
            semesterYear={semesterInfo["year"]}
            semesterType={semesterInfo["type"]}
          />
        </div>
      </Paper>
    </div>
  );
}

export default Navbar;
