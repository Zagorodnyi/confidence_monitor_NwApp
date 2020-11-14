import React, { Component } from "react";

export class bigTimeLayout extends Component {
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
        <div className="lyrics">
          <div className="timerBig">
            <h2>Залишилось часу: </h2>
            {this.props.Timer}
          </div>
        </div>
        <div>
          <div
            className="capture"
            style={this.props.timeIsUp ? { color: "red" } : {}}
          >
            <h2>Служіння триває: </h2>
            {this.props.Capture}
          </div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default bigTimeLayout;
