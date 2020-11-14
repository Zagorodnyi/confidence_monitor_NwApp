// React imports
import React, { Component } from "react";
import Fade from "react-reveal/Fade";
// DayJS imports
import dayjs from "dayjs";
import "dayjs/locale/uk";
// Socket imports
import io from "socket.io-client";
import {
  SUCCESS,
  TIMER_DATA,
  CAPTURE_DATA,
  LAYOUT,
  SETTINGS_CHANGED
} from "./utils/CONST_events";
// Assets imposrt
import loader from "./Loading.svg";
import "./App.css";
// Layouts imports
import MainLayout from "./components/MainLayout";
import BigTimeLayout from "./components/bigTimeLayout";
import fingerprint from "@fingerprintjs/fingerprintjs"
import updater from './updater'

import { connect } from 'react-redux'
import { getSettings, postSettings, setDeviceId, setDate, setSocketId, setLayout } from './redux/actions'


class App extends Component {
  state = {
    deviceId: "",
    date: "",
    timer: {
      minutes: "00",
      seconds: "00",
    },
    capture: {
      hours: "00",
      minutes: "00",
    },
    flash: false,
    connected: false,
    timeIsUp: false,
    bigTimeLayout: false,
  };

  // Updates Date every 5s
  getDate() {
    setInterval(() => {
      //Format date
      const date = dayjs().locale("uk").format("dddd D MMM HH:mm");
      this.props.setDate(date.toUpperCase().split(" "));
    }, 5000);
  }


  async componentDidMount() {
    updater()
    try {
      const fp = await fingerprint.load()
      const result = await fp.get();
      this.props.setDeviceId(result.visitorId)
      this.props.getSettings(result.visitorId)
    }
    catch (err) {
      console.log(err)
    }
    if (!this.state.connected) {
      this.socket = io("http://fierce-sierra-99883.herokuapp.com/timer", {
        // this.socket = io("http://localhost:3000/timer", {
        transports: ["websocket"],
        query: {
          deviceId: this.props.deviceId
        }
      });
      // Socket responded success
      this.socket.on(SUCCESS, () => {
        this.props.setSocketId(this.socket.id)
        this.getDate();
        this.setState({ connected: true });
      });
      // On error
      this.socket.on("connect_error", () => {
        this.setState({ connected: false });
      });
      // On disconnect
      this.socket.on("disconnect", () => {
        this.setState({ connected: false });
      });
      // Timer CountDown event with {minutes, seconds}
      this.socket.on(TIMER_DATA, (data) => {
        // Screen flashing red
        if (data.minutes < 0) {
          this.setState({ flash: !this.state.flash });
        } else {
          this.setState({ flash: false });
        }
        this.setState({ timer: data });
      });
      // Stopwatch event with {hours, minutes}
      this.socket.on(CAPTURE_DATA, (data) => {
        this.setState({ capture: data });
      });
      this.socket.on(SETTINGS_CHANGED, (data) => {
        if (data === this.props.deviceId) {
          this.props.getSettings(this.props.deviceId)
        }
      });
      // Layout change event
      this.socket.on(LAYOUT, () => {
        const lastprop = this.props.bigTimeLayout
        this.props.setLayout(!lastprop);
        this.props.postSettings({ bigTimeLayout: !lastprop }, this.props.deviceId)
      });
    }
  }

  // Timer component
  generateTimer() {
    return (
      <h1>
        {this.state.timer.minutes}:{this.state.timer.seconds}
      </h1>
    );
  }

  // Stopwatch component
  generateCapture() {
    return (
      <h1>
        {this.state.capture.hours}:{this.state.capture.minutes}
      </h1>
    );
  }

  render() {
    return this.state.connected ? (
      <Fade duration={2000}>
        {this.props.bigTimeLayout ? (
          <BigTimeLayout
            flash={this.state.flash}
            date={this.props.date}
            Timer={this.generateTimer()}
            Capture={this.generateCapture()}
            timeIsUp={this.state.timeIsUp}
          />
        ) : (
            <MainLayout
              flash={this.state.flash}
              date={this.props.date}
              Timer={this.generateTimer()}
              Capture={this.generateCapture()}
              timeIsUp={this.state.timeIsUp}
            />
          )}
      </Fade>
    ) : (
        // If socket not connected
        <div className="root" style={{ display: "grid", placeItems: "center" }}>
          <h1 style={{ color: "white" }}>Waiting for connection</h1>
          <img alt="Connecting" src={loader}></img>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  bigTimeLayout: state.bigTimeLayout,
  date: state.date,
  deviceId: state.deviceId,
})

const mapActionsToProps = {
  getSettings,
  setDeviceId,
  setDate,
  setSocketId,
  setLayout,
  postSettings
}
export default connect(mapStateToProps, mapActionsToProps)(App);
