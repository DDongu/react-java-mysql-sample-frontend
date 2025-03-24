import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import { Table, Alert } from "react-bootstrap";

class App extends Component {
  state = {
    countryWiseData: [],
  };

  componentDidMount() {
    const backendUrl = process.env.REACT_APP_BACKEND_API; // ✅ 환경 변수에서 백엔드 URL 가져오기
    if (!backendUrl) {
      console.error("REACT_APP_BACKEND_API 환경 변수가 설정되지 않았습니다.");
      return;
    }

    axios
      .get(`${backendUrl}/coronatracker/statisticsbycountry`)
      .then((response) => {
        this.setState({
          countryWiseData: response.data.data,
        });
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  }

  render() {
    let countryWiseData = this.state.countryWiseData.map((country) => {
      return (
        <tr key={country.country_code}>
          <td>{country.location}</td>
          <td>{country.confirmed}</td>
          <td>{country.dead}</td>
          <td>{country.recovered}</td>
        </tr>
      );
    });

    return (
      <div className="App">
        <div className="container fluid">
          <Alert variant="primary">Coronavirus Statistics By Country</Alert>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Country</th>
                <th>Confirmed Cases</th>
                <th>Deaths</th>
                <th>Recovered</th>
              </tr>
            </thead>
            <tbody>{countryWiseData}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
