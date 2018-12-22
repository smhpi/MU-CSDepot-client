import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col,
  Panel,
  Glyphicon,
  Button
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import "./NewNote.css";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: "",
      title: "",
      price: "",
      sku: "",
      upc: "",
      mpn: "",
      shq: "",
      bbq: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file ? await s3Upload(this.file) : null;

      await this.createNote({
        attachment,
        content: this.state.content,
        title: this.state.title,
        price: this.state.price,
        sku: this.state.sku,
        upc: this.state.upc,
        mpn: this.state.mpn,
        shq: this.state.shq,
        bbq: this.state.bbq
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }
  render() {
    return (
      <div className="NewNote">
        <Grid>
          <Link to="/listing">
            <Glyphicon glyph="chevron-left" />
            {"Listing "}
          </Link>
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <Panel>
              <Panel.Heading>
                <Panel.Title componentClass="h1">Add Product</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <ControlLabel>Title</ControlLabel>
                <FormGroup controlId="title">
                  <FormControl
                    onChange={this.handleChange}
                    value={this.state.title}
                    type="text"
                    bsSize="lg"
                  />
                </FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormGroup controlId="content">
                  <FormControl
                    onChange={this.handleChange}
                    value={this.state.content}
                    componentClass="textarea"
                  />
                </FormGroup>
                <Row>
                  <Col md={4}>
                    <ControlLabel>Price</ControlLabel>
                    <FormGroup controlId="price">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.price}
                        type="text"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Heading> Inventory </Panel.Heading>
              <Panel.Body>
                <Row>
                  <Col md={4}>
                    <ControlLabel>SKU</ControlLabel>
                    <FormGroup controlId="sku">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.sku}
                        type="text"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <ControlLabel>UPC/Barcode</ControlLabel>
                    <FormGroup controlId="upc">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.upc}
                        type="text"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <ControlLabel>#MPN</ControlLabel>
                    <FormGroup controlId="mpn">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.mpn}
                        type="text"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <ControlLabel>Shopify Qt</ControlLabel>
                    <FormGroup controlId="shq">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.shq}
                        type="number"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <ControlLabel>BestBuy Qt</ControlLabel>
                    <FormGroup controlId="bbq">
                      <FormControl
                        onChange={this.handleChange}
                        value={this.state.bbq}
                        type="number"
                        bsSize="lg"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Heading>Images</Panel.Heading>
              <Panel.Body>
                <FormGroup controlId="file">
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl onChange={this.handleFileChange} type="file" />
                </FormGroup>
              </Panel.Body>
            </Panel>
            <Row className="ActionRow">
              <Col md={1}>
                <LinkContainer to="/">
                  <Button bsSize="lg">Cancel</Button>
                </LinkContainer>
              </Col>
              <Col md={2}>
                <LoaderButton
                  block
                  bsStyle="primary"
                  bsSize="lg"
                  disabled={!this.validateForm()}
                  type="submit"
                  isLoading={this.state.isLoading}
                  text="Save product"
                  loadingText="Creating…"
                />
              </Col>
            </Row>
          </form>
        </Grid>
      </div>
    );
  }
}
