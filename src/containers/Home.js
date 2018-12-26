import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Row, Col, Image } from "react-bootstrap";
import "./Home.css";
import mlogos from "../images/mlogos.png";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  welcomePage() {
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
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }

  landerPage() {
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

  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="lander">
            <Grid>
              <Row>
                <Col md={12}>
                  {this.props.isAuthenticated
                    ? this.welcomePage()
                    : this.landerPage()}
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
