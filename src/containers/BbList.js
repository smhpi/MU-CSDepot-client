import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  Jumbotron,
  Glyphicon,
  Grid,
  Col,
  Row,
  Form,
  FormGroup,
  Checkbox,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";

class BbList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      bblist: [],
      bbClick: false,
      bbChecked: []
    };
  }

  componentDidMount() {
    const url =
      "https://marketplace.bestbuy.ca/api/offers?api_key=7b363e5a-ea5c-4cc0-b361-32eebbbe42ac&max=100";

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json"
      }
    })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        this.setState({
          bblist: data.offers
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleClick = () => {
    this.setState({ bbClick: true });
  };

  handleChange = event => {
    const bbChecked = this.state.bbChecked;
    if (event.target.checked) {
      bbChecked.push(event.target.value);
    } else {
      let index = bbChecked.indexOf(+event.target.value);
      bbChecked.splice(index, 1);
    }
    this.setState({
      bbChecked: bbChecked
    });
    console.log(this.state.bbChecked);
  };

  dbUpdate = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.bbUpdate({
        bbq: this.state.bblist[4].quantity
      });

      this.props.history.push("/listing");
    } catch (e) {
      alert(e);
    }
  };

  bbUpdate(note) {
    return API.put("notes", `/notes/${this.state.bbChecked}`, {
      body: note
    });
  }

  handleAPI = () => {
    const BestBuyList = this.state.bblist;

    return (
      <Grid>
        <Form onSubmit={this.dbUpdate}>
          <Table responsive>
            <tbody>
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>

              {BestBuyList.map(list => (
                <tr key={list.offer_id}>
                  <td>
                    <FormGroup>
                      <Checkbox
                        value={list.shop_sku}
                        onChange={this.handleChange}
                      >
                        <ControlLabel>{list.shop_sku}</ControlLabel>
                      </Checkbox>
                    </FormGroup>
                  </td>

                  <td>{list.product_title}</td>
                  <td>${list.price}</td>
                  <td>{list.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving…"
          />
        </Form>
        <LoaderButton
          block
          onClick={this.dbUpdate}
          bsStyle="success"
          text="Refresh"
          isLoading={this.state.isLoading}
          loadingText="Saving..."
        />
      </Grid>
    );
  };

  render() {
    return (
      <Jumbotron>
        <Grid>
          <Row>
            <Col md={10}>
              <Link to="/listing">
                <Glyphicon glyph="chevron-left" />
                {"Listing"}
              </Link>
            </Col>
            <Col md={2}>
              <Button onClick={this.handleClick}>BestBuy Data</Button>
            </Col>
          </Row>
          <Row>
            <Col>{this.state.bbClick ? this.handleAPI() : null}</Col>
          </Row>
        </Grid>
      </Jumbotron>
    );
  }
}

export default BbList;
