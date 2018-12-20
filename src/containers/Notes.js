import React, { Component } from "react";
import { Link } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col,
  Glyphicon,
  Panel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      title: "",
      price: "",
      sku: "",
      upc: "",
      mpn: "",
      shq: "",
      bbq: "",
      attachmentURL: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const {
        content,
        title,
        price,
        sku,
        upc,
        mpn,
        shq,
        bbq,
        attachment
      } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        title,
        price,
        sku,
        upc,
        mpn,
        shq,
        bbq,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  handleSubmit = async event => {
    let attachment;

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
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveNote({
        content: this.state.content,
        title: this.state.title,
        price: this.state.price,
        sku: this.state.sku,
        upc: this.state.upc,
        mpn: this.state.mpn,
        shq: this.state.shq,
        bbq: this.state.bbq,
        attachment: attachment || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  render() {
    return (
      <div className="Notes">
        <Link to="/">
          <Glyphicon glyph="chevron-left" />
          {"Products "}
        </Link>
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <Grid>
              <Panel>
                <Panel.Heading> </Panel.Heading>
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

              {this.state.note.attachment && (
                <FormGroup>
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl.Static>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={this.state.attachmentURL}
                    >
                      {this.formatFilename(this.state.note.attachment)}
                    </a>
                  </FormControl.Static>
                </FormGroup>
              )}
              <FormGroup controlId="file">
                {!this.state.note.attachment && (
                  <ControlLabel>Attachment</ControlLabel>
                )}
                <FormControl onChange={this.handleFileChange} type="file" />
              </FormGroup>

              <Row className="ActionRow">
                <Col md={2}>
                  <LoaderButton
                    block
                    bsStyle="primary"
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Save"
                    loadingText="Saving…"
                  />
                </Col>
                <Col md={2}>
                  <LoaderButton
                    block
                    bsStyle="danger"
                    bsSize="large"
                    isLoading={this.state.isDeleting}
                    onClick={this.handleDelete}
                    text="Delete"
                    loadingText="Deleting…"
                  />
                </Col>
              </Row>
            </Grid>
          </form>
        )}
      </div>
    );
  }
}
