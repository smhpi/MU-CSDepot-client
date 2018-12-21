import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  PageHeader,
  ListGroup,
  Grid,
  Row,
  Col,
  Image,
  Table,
  Button
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
    return (
      <Table responsive>
        <tbody>
          <tr>
            <th>#</th>
            <th>SKU</th>
            <th>Title</th>
            <th>BestBuy Quantity</th>
            <th>Shopify Quantity</th>
          </tr>

          {[{}].concat(notes).map((note, i) =>
            i !== 0 ? (
              <tr key={note.noteId}>
                <td>{i}</td>
                <td>{note.sku}</td>
                <td>
                  <Link to={`/notes/${note.noteId}`}>
                    <span>{note.title.trim().split("\n")[0]}</span>
                  </Link>
                </td>
                <td>{note.bbq}</td>
                <td>{note.shq}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>
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
      <Grid className="notes">
        <Row>
          <Col md={10}>
            <PageHeader>
              <small>Products List</small>
            </PageHeader>
          </Col>
          <Col mf={1}>
            <LinkContainer key="new" to="/notes/new">
              <Button bsStyle="primary">
                <h5>
                  <b>{"\uFF0B"}</b> Add
                </h5>
              </Button>
            </LinkContainer>
            <LinkContainer to="/bestbuy">
              <Button>BestBuy</Button>
            </LinkContainer>
            <Button>Shopify</Button>
          </Col>
        </Row>
        <Row>
          <ListGroup>
            {!this.state.isLoading && this.renderNotesList(this.state.notes)}
          </ListGroup>
        </Row>
      </Grid>
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
