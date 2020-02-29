import React from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

import Intro from "./Intro";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleInputErrors = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <>
        <Intro />
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="black" textAlign="center">
              <Icon name="y combinator" color="yellow" />
              Login To Yabber
            </Header>
            <Form onSubmit={this.handleSubmit} size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email Adress"
                  onChange={this.handleChange}
                  value={email}
                  type="email"
                  className={this.handleInputErrors(errors, "email")}
                  placeholder="fortest@yabber.com"
                />
                <Form.Input
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  onChange={this.handleChange}
                  value={password}
                  type="password"
                  className={this.handleInputErrors(errors, "password")}
                  placeholder="123456"
                />
                <Button
                  disabled={loading}
                  className={loading ? "loading" : ""}
                  color="yellow"
                  fluid
                  size="large"
                >
                  Submit
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default Login;
