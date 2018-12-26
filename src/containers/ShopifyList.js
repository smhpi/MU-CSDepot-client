import React, { Component } from "react";
import { Grid, Table, Thumbnail } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { products } from "../libs/products.json";
import { API } from "aws-amplify";

class ShopifyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: null,
      shpList: []
    };
  }

  componentDidMount() {
    this.setState({ shpList: products });
  }

  dbRefresh = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      for (let i = 0; i < this.state.shpList.length - 1; i++) {
        await this.shUpdate({
          content: this.state.shpList[i].body_html,
          title: this.state.shpList[i].title,
          price: this.state.shpList[i].variants[0].price,
          sku: this.state.shpList[i].variants[0].sku,
          shq: this.state.shpList[i].variants[0].inventory_quantity,
          img: this.state.shpList[i].image.src
        });
      }
      this.props.history.push("listing");
    } catch (e) {
      alert(e);
    }
  };

  shUpdate(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  render() {
    const ShopifyProduct = this.state.shpList;
    console.log(ShopifyProduct);
    return (
      <Grid>
        <Table responsive>
          <tbody>
            <tr>
              <th>#</th>
              <th>SKU</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
            {ShopifyProduct.map(item => (
              <tr key={item.id}>
                <td>
                  <Thumbnail
                    src={item.image.src}
                    responsive
                    style={{ maxWidth: 120 }}
                  />{" "}
                </td>
                <td>{item.variants[0].sku}</td>
                <td>{item.title}</td>
                <td>{item.variants[0].price}</td>
                <td>{item.variants[0].inventory_quantity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <LoaderButton
          block
          onClick={this.dbRefresh}
          bsStyle="success"
          text="Refresh"
          isLoading={this.state.isLoading}
          loadingText="Saving..."
        />
      </Grid>
    );
  }
}
export default ShopifyList;
