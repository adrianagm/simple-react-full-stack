import React from "react";
import {
  render
} from "react-dom";
import {
  makeData,
  Tips
} from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

// Import React Table


class TableLogos extends React.Component {
  constructor() {
    super();
    this.state = {
      headers: [],
      topLogos: []
    };
  }

  componentDidMount() {
    fetch('/api/getLogos')
      .then(res => res.json())
      .then((data) => {
        console.log(data.topLogos);
        console.log(data.columns);
        this.setState({
          headers: data.headers,
          topLogos: data.topLogos
        })
      });
  }

  render() {
    const {
      headers,
      topLogos
    } = this.state;

    console.log(this.headers);
    return ( < div >
      <
      ReactTable data = {
        topLogos
      }
      columns = {
        headers
      }
      defaultPageSize = {
        10
      }
      className = '-striped -highlight' / >
      <
      br / >
      <
      Tips / >

      <
      /div>
    );
  }
}

render( < TableLogos / > , document.getElementById('root'));
