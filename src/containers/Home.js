import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  Grid,
  Row,
  Col,
  Image
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";
import mlogos from "../images/mlogos.png";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("notes", "/notes");
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Add
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  renderLander() {
    return (
      <div className="jumbotron">
        <div className="lander">
          <Grid>
            <Row>
              <Col md={8}>
                <h1>MarketUnity</h1>
                <p>MarketPlaces Integration Portal</p>
                <div>
                  <Image src={mlogos} responsive />
                </div>
              </Col>
              <Col md={4}>
                <div className="lander">
                  <p />
                  <div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed placerat lacus purus, nec varius ante imperdiet vitae.
                      Fusce in efficitur nunc. Cras tortor nunc, consequat ut
                      sapien in, maximus hendrerit nunc. Phasellus malesuada
                      diam in urna rutrum ultrices.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg">
                      Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary btn-lg">
                      Signup
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Products List</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="lander">
            <Grid>
              <Row>
                <Col md={12}>
                  {this.props.isAuthenticated
                    ? this.renderNotes()
                    : this.renderLander()}
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
