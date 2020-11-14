import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListIcon from "@material-ui/core/ListItemIcon";
import Slider from "@material-ui/core/Slider";
import TextField from '@material-ui/core/TextField'

import Check from "../Img/check.svg";

export default function ParamsDialog(props) {
  const generateList = () => {
    const videoDevices = props.deviceList.filter((device) => {
      return device.kind === "videoinput";
    });
    return videoDevices.map((device, index) => {
      return (
        <ListItem
          button
          key={index}
          onClick={() => props.handleClick(device.deviceId)}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {device.label}
          {props.currentDevice === device.deviceId ? (
            <ListIcon>
              <img alt="check" src={Check} width="20px" height="20px" />
            </ListIcon>
          ) : null}
        </ListItem>
      );
    });
  };
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      style={{ textAlign: "center" }}
    >
      <DialogTitle>Choose input</DialogTitle>
      <List style={{ width: "400px" }}>{generateList()}</List>
      <DialogTitle>Source Scale</DialogTitle>
      <Slider
        style={{ width: "50%", margin: "auto", paddingBottom: "20px" }}
        value={props.scaleValue}
        onChange={props.scale}
        marks
        defaultValue={1}
        step={0.5}
        min={1}
        max={4}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
      />
      <TextField
        label="Device name"
        style={{ width: "50%", margin: "25px auto" }}
        value={props.deviceName}
        onChange={props.onNameChange} />
    </Dialog>
  );
}
