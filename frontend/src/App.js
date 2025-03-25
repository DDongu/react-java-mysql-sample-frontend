import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import { Table, Alert, Button, Form } from "react-bootstrap";

class App extends Component {
  state = {
    countryWiseData: [],
    comments: [],
    newComment: { title: "", desc: "" },
    editComment: { id: "", title: "", desc: "" },
  };

  componentDidMount() {
    const backendUrl = process.env.REACT_APP_BACKEND_API;
    if (!backendUrl) {
      console.error("REACT_APP_BACKEND_API 환경 변수가 설정되지 않았습니다.");
      return;
    }

    // ✅ 국가별 코로나 데이터 가져오기
    axios
      .get(`${backendUrl}/coronatracker/statisticsbycountry`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("API 응답 데이터가 배열이 아닙니다.", response.data);
          return;
        }
        this.setState({ countryWiseData: response.data });
      })
      .catch((error) => {
        console.error("API 요청 실패 (코로나 데이터):", error);
      });

    // ✅ 댓글 데이터 가져오기
    this.fetchComments();
  }

  fetchComments = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_API;
    axios
      .get(`${backendUrl}/getComments`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("API 응답 데이터가 배열이 아닙니다.", response.data);
          return;
        }
        this.setState({ comments: response.data });
      })
      .catch((error) => {
        console.error("API 요청 실패 (댓글 데이터):", error);
      });
  };

  // ✅ 댓글 저장 (POST)
  saveComment = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_API;
    axios
      .post(`${backendUrl}/saveComments`, this.state.newComment)
      .then(() => {
        this.setState({ newComment: { title: "", desc: "" } });
        this.fetchComments(); // 댓글 목록 새로고침
      })
      .catch((error) => {
        console.error("댓글 저장 실패:", error);
      });
  };

  // ✅ 댓글 수정 (PUT)
  updateComment = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_API;
    axios
      .put(`${backendUrl}/updateComment/${this.state.editComment.id}`, this.state.editComment)
      .then(() => {
        this.setState({ editComment: { id: "", title: "", desc: "" } });
        this.fetchComments(); // 댓글 목록 새로고침
      })
      .catch((error) => {
        console.error("댓글 수정 실패:", error);
      });
  };

  // ✅ 댓글 삭제 (DELETE)
  deleteComment = (id) => {
    const backendUrl = process.env.REACT_APP_BACKEND_API;
    axios
      .delete(`${backendUrl}/deleteComment/${id}`)
      .then(() => {
        this.fetchComments(); // 댓글 목록 새로고침
      })
      .catch((error) => {
        console.error("댓글 삭제 실패:", error);
      });
  };

  render() {
    // ✅ 국가별 코로나 데이터 테이블
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

    // ✅ 댓글 데이터 테이블
    let commentData = Array.isArray(this.state.comments)
      ? this.state.comments.map((comment) => (
          <tr key={comment.id}>
            <td>{comment.id}</td>
            <td>{comment.title}</td>
            <td>{comment.desc}</td>
            <td>
              <Button variant="warning" onClick={() => this.setState({ editComment: comment })}>
                ✏ 수정
              </Button>{" "}
              <Button variant="danger" onClick={() => this.deleteComment(comment.id)}>
                🗑 삭제
              </Button>
            </td>
          </tr>
        ))
      : [];

    return (
      <div className="App">
        <div className="container">
          {/* 🔹 코로나 데이터 테이블 */}
          <Alert variant="primary">📊 Coronavirus Statistics By Country</Alert>
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

          {/* 🔹 댓글 추가 폼 */}
          <Alert variant="success">➕ Add New Comment</Alert>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={this.state.newComment.title}
                onChange={(e) => this.setState({ newComment: { ...this.state.newComment, title: e.target.value } })}
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={this.state.newComment.desc}
                onChange={(e) => this.setState({ newComment: { ...this.state.newComment, desc: e.target.value } })}
                placeholder="Enter description"
              />
            </Form.Group>
            <Button variant="primary" onClick={this.saveComment}>
              ✅ Save Comment
            </Button>
          </Form>

          {/* 🔹 댓글 수정 폼 */}
          {this.state.editComment.id && (
            <>
              <Alert variant="warning">✏ Edit Comment</Alert>
              <Form>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.editComment.title}
                    onChange={(e) => this.setState({ editComment: { ...this.state.editComment, title: e.target.value } })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.editComment.desc}
                    onChange={(e) => this.setState({ editComment: { ...this.state.editComment, desc: e.target.value } })}
                  />
                </Form.Group>
                <Button variant="warning" onClick={this.updateComment}>
                  ✅ Update Comment
                </Button>
              </Form>
            </>
          )}

          {/* 🔹 댓글 데이터 테이블 */}
          <Alert variant="secondary">💬 User Comments</Alert>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{commentData}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
