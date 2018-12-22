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

export default class Listing extends Component {
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

  renderNotes() {
    return (
      <Grid className="notes">
        <Row>
          <Col md={8}>
            <PageHeader>
              <small>Products List</small>
            </PageHeader>
          </Col>
          <Col mf={4}>
            <LinkContainer key="new" to="/notes/new">
              <Button bsStyle="primary pull-right">
                <b>{"\uFF0B"}</b> Add
              </Button>
            </LinkContainer>
            <LinkContainer to="/bestbuy">
              <Button bsStyle="success pull-right">BestBuy</Button>
            </LinkContainer>
            <Button bsStyle="success pull-right">Shopify</Button>
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
                <Col md={12}>{this.renderNotes()}</Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
