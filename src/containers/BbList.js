import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table, Jumbotron, Glyphicon } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import BBAPI from "../libs/BestBuyAPI";
import ListStore from "../components/ListStore";
import { API } from "aws-amplify";

class BbList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      bblist: [],
      bbClick: false
    };
  }

  componentDidMount() {
    const url =
      "https://marketplace.bestbuy.ca/api/offers?api_key=7b363e5a-ea5c-4cc0-b361-32eebbbe42ac&max=100";
    fetch(url)
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

  dbUpdate = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      for (let i = 0; i < this.state.bblist.length - 1; i++) {
        await this.bbUpdate({
          content: this.state.bblist[i].product_title,
          title: this.state.bblist[i].product_title,
          price: this.state.bblist[i].price,
          sku: this.state.bblist[i].shop_sku,
          upc: this.state.bblist[i].product_references[0].reference,
          mpn: this.state.bblist[i].shop_sku,
          bbq: this.state.bblist[i].quantity
        });
      }
      this.props.history.push("/");
    } catch (e) {
      alert(e);
    }
  };

  bbUpdate(note) {
    return API.put("notes", "/notes", {
      body: note
    });
  }

  handleAPI = () => {
    const BestBuyList = this.state.bblist;
    console.log(BestBuyList);
    return (
      <div>
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
                <td>{list.shop_sku}</td>
                <td>{list.product_title}</td>
                <td>${list.price}</td>
                <td>{list.quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <LoaderButton
          block
          onClick={this.dbUpdate}
          bsStyle="success"
          text="Refresh"
          isLoading={this.state.isLoading}
          loadingText="Saving..."
        />
      </div>
    );
  };

  render() {
    return (
      <Jumbotron>
        <Link to="/">
          <Glyphicon glyph="chevron-left" />
          {"Products "}
        </Link>
        <br />
        <br />

        <Button onClick={this.handleClick}>BestBuy Data</Button>
        {this.state.bbClick ? this.handleAPI() : null}
      </Jumbotron>
    );
  }
}

export default BbList;
