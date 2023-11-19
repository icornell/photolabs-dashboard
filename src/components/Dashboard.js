import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads,
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }

];

class Dashboard extends Component {
  //initial state
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  };
  //lifecycle method - componentDidMount
  componentDidMount() {
    //fetch data from the API
    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(res => res.json()));
    //Promise.all() - takes an array of promises and returns a single promise
    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });
    //check if there is a focused item in localStorage
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({focused});
    }
  }
  //lifecycle method - componentDidUpdate
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  //instance method
  selectPanel(id) {
    this.setState((previousState) => ({
      focused: previousState.focused != null ? null : id,
    }));
  }
  //render method
  render() {
    //classnames package - allows us to conditionally apply classes to an element
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });
    //if loading is true, return the Loading component
    if (this.state.loading) {
      return <Loading />;
    }
    console.log(this.state); //test
    //map over the data array and return a Panel component for each item in the array
    const panels = (
      this.state.focused
        ? data.filter((panel) => this.state.focused === panel.id)
        : data
    ).map((panel) => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.getValue(this.state)}
        //passing the instance method as a prop instead of above as a class property arrow method
        onSelect={(event) => this.selectPanel(panel.id)}
      />
    ));
    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
