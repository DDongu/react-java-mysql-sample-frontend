componentDidMount() {
  const backendUrl = process.env.REACT_APP_BACKEND_API;
  if (!backendUrl) {
    console.error("REACT_APP_BACKEND_API 환경 변수가 설정되지 않았습니다.");
    return;
  }

  axios
    .get(`${backendUrl}/coronatracker/statisticsbycountry`)
    .then((response) => {
      if (!Array.isArray(response.data)) {
        console.error("API 응답 데이터가 배열이 아닙니다.", response.data);
        return;
      }
      this.setState({
        countryWiseData: response.data,  // ✅ 올바른 데이터 필드 사용
      });
    })
    .catch((error) => {
      console.error("API 요청 실패:", error);
    });
}

render() {
  let countryWiseData = Array.isArray(this.state.countryWiseData) 
    ? this.state.countryWiseData.map((country) => (
        <tr key={country.country_code}>
          <td>{country.location}</td>
          <td>{country.confirmed}</td>
          <td>{country.dead}</td>
          <td>{country.recovered}</td>
        </tr>
      ))
    : [];

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
