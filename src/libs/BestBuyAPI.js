import ServerAction from "../components/ServerAction";
let BBAPI = {
  fetchBBList() {
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
};
export default BBAPI;
