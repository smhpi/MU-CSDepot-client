import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import BBAPI from "../libs/BestBuyAPI";
import ListStore from "../components/ListStore";

class BbList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bblist: [],
      bbClick: false
    };
  }

  componentDidMount() {
    const url =
      "https://marketplace.bestbuy.ca/api/offers?api_key=7b363e5a-ea5c-4cc0-b361-32eebbbe42ac&max=100";
    fetch(url, { mode: "cors" })
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

  handleAPI = () => {
    const BestBuyList = this.state.bblist;

    return (
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
    );
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>BestBuy Data</Button>
        {this.state.bbClick ? this.handleAPI() : null}
      </div>
    );
  }
}

export default BbList;
