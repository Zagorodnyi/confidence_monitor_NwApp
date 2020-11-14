import React, { Component } from "react";
// @material-ui/core

import ParamsDialog from "./ParamsDialog";
import { connect } from 'react-redux'
import { updateSettings, postSettings, setCurrentDevice, setScale, setName, startCameras } from '../redux/actions'


export class MainLayout extends Component {
  state = {
    openDialog: false,
    started: false,
  };
  componentDidMount() {
    this.props.startCameras(this.props.currentDevice)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.scale !== nextProps.scale ||
      this.props.currentDevice !== nextProps.currentDevice ||
      this.state.openDialog !== nextState.openDialog ||
      this.props.deviceName !== nextProps.deviceName ||
      this.props.Timer !== nextProps.Timer ||
      this.props.Capture !== nextProps.Capture ||
      this.props.flash !== nextProps.flash ||
      this.props.timeIsUp !== nextProps.timeIsUp ||
      this.props.date !== nextProps.date
    ) {
      return true
    } else return false

  }

  onRightClick = (e) => {
    e.preventDefault();
    this.setState({ openDialog: true });
  };

  onCloseDialog = async () => {
    this.props.postSettings({
      scale: this.props.scale ?? 2.5,
      currentDevice: this.props.currentDevice ?? "",
      deviceList: this.props.deviceList ?? [],
      socketId: this.props.socketId ?? "",
      bigTimeLayout: this.props.bigTimeLayout ?? false,
      deviceName: this.props.deviceName ?? 'default'
    }, this.props.deviceId)

    this.setState({ openDialog: false });
  };

  setScale = (event, value) => {
    if (this.props.scale !== value) {
      this.props.setScale(value);
    }
    return;
  };
  onNameChange = (event) => {
    this.props.setName(event.target.value)
  }

  handleListClick = async (value) => {
    if (!navigator.mediaDevices) {
      return;
    }
    this.setState({ openDialog: false });
    this.props.setCurrentDevice(value);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: `${value}`,
          },
        },
      });

      this.props.postSettings({
        scale: this.props.scale ?? 2.5,
        currentDevice: this.props.currentDevice ?? "",
        deviceList: this.props.deviceList ?? [],
        socketId: this.props.socketId ?? "",
        bigTimeLayout: this.props.bigTimeLayout ?? false,
        deviceName: this.props.deviceName ?? 'default'
      }, this.props.deviceId)

      const video = document.querySelector("video");
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {

        video.play();
      };
    }
    catch (err) {
      console.log(err)
    }

  };

  render() {
    return (
      <div
        className="root"
        style={
          this.props.flash
            ? { backgroundColor: "red" }
            : { backgroundColor: "black" }
        }
      >
        <div className="date">
          <h1>
            <strong>{this.props.date[3]}</strong>
          </h1>
          <h1>{`${this.props.date[0]}, ${this.props.date[1]} ${this.props.date[2]}`}</h1>
        </div>

        <div onContextMenu={this.onRightClick} className="lyrics">
          <video style={{ transform: `scale(${this.props.scale})` }}></video>
        </div>

        <div className="timersWrapper">
          <div className="timer">
            <h2>Залишилось часу: </h2>
            {this.props.Timer}
          </div>
          <div
            className="capture"
            style={this.props.timeIsUp ? { color: "red" } : {}}
          >
            <h2>Служіння триває: </h2>
            {this.props.Capture}
          </div>
          <div></div>
        </div>

        <ParamsDialog
          deviceList={this.props.deviceList}
          handleClick={this.handleListClick.bind(this)}
          open={this.state.openDialog}
          onClose={this.onCloseDialog.bind(this)}
          scale={this.setScale.bind(this)}
          scaleValue={this.props.scale}
          currentDevice={this.props.currentDevice}
          onNameChange={this.onNameChange.bind(this)}
          deviceName={this.props.deviceName}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scale: state.scale,
    currentDevice: state.currentDevice,
    deviceList: state.deviceList,
    deviceId: state.deviceId,
    socketId: state.socketId,
    bigTimeLayout: state.bigTimeLayout,
    deviceName: state.deviceName

  }
}

const mapActionsToProps = {
  updateSettings,
  postSettings,
  setCurrentDevice,
  setScale,
  setName,
  startCameras
}

export default connect(mapStateToProps, mapActionsToProps)(MainLayout);
