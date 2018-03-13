/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Select, MenuItem, Button, TextField } from "zrmc";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ProcessingDialog from "zoapp-front/containers/processingDialog";

import TemplatesList from "../components/templatesList";
import { apiCreateBot } from "../actions/api";
import { appSetTitle } from "../actions/app";

const advancedStyle = {
  marginLeft: "16px",
  color: "rgba(0, 0, 0, 0.54)",
};

const boxStyle = {
  margin: "16px",
};

const headerStyle = {
  padding: "16px",
};

const h4 = {
  marginTop: "0px",
  marginBottom: "16px",
  fontSize: "16px",
  color: "rgba(0, 0, 0, 0.87)",
};
const secText = {
  color: "rgba(0, 0, 0, 0.54)",
};

// TODO get templates from API
const templates = [
  { id: 1, name: "Empty" },
  { id: 2, name: "HelloWorld" },
  { id: 3, name: "Test1" },
  { id: 4, name: "Import" },
];

export class CreateAssistantBase extends Component {
  state = {
    name: "",
    email: "",
    username: "",
    password: "",
    language: "en",
    loading: false,
    selectedTemplate: 0,
    template: null,
  };

  componentWillMount() {
    this.props.appSetTitle("Create your virtual assistant");
  }

  componentDidUpdate() {
    if (this.state.loading && this.props.isLoading === false) {
      this.handleCloseCreateDialog();
    }
  }

  onImportTemplate = (data) => {
    // TODO check if json
    const json = JSON.parse(data);
    this.onSelectTemplate(3, json);
  };

  onSelectTemplate = (selected, data) => {
    let template = data;
    if (!template) {
      template = templates[selected];
    }
    this.setState({ selectedTemplate: selected, template });
  };

  handleCloseCreateDialog = () => {
    this.setState({ loading: false });
    Zrmc.closeDialog();
    if (!this.props.error) {
      this.props.history.push("/builder");
    }
  };

  handleCreate = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      username,
      password,
      language,
      template,
      loading,
    } = this.state;

    if (loading === false) {
      const botParams = {
        name,
        email,
        username,
        password,
        template,
        language,
      };

      this.setState({ loading: true });

      Zrmc.showDialog(
        <ProcessingDialog open onClosed={this.handleCloseDialog} />,
      );

      this.props.createBot(botParams);
    } else {
      // TODO display errors in dialogs
    }
  };

  handleLanguageChange = (language) => {
    this.setState({ language });
  };

  createChangeHandler = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  render() {
    const {
      name,
      email,
      username,
      password,
      selectedTemplate: selected,
    } = this.state;

    // TODO json only for instance
    const acceptImport = "application/json";
    return (
      <div className="mdl-layout__content mdl-color--grey-100">
        <section className="mdl-color--white mdl-shadow--2dp" style={boxStyle}>
          <div style={headerStyle}>
            <h4 style={h4}>Opla !</h4>
            <div style={secText}>
              Welcome to our five minutes installation process! Just fill in the
              informations below and you will get the most powerfull and
              extendable bot platform in the world.
            </div>
          </div>
        </section>
        <section className="mdl-color--white mdl-shadow--2dp" style={boxStyle}>
          <div style={headerStyle}>
            <h4 style={h4}>Templates</h4>
            <div style={secText}>
              Choose a prebuild asssistant, import one or select an empty model.
            </div>
          </div>
          <TemplatesList
            items={templates}
            selectedItem={selected}
            onSelect={this.onSelectTemplate}
            onImport={this.onImportTemplate}
            acceptImport={acceptImport}
          />
          <div style={headerStyle}>
            <div style={secText}>
              Want more ?
              <br />
              In a near future we will release our BotStore to find the perfect
              bot from our community.
              <br />
            </div>
          </div>
        </section>
        <form
          id="create-assistant-form"
          autoComplete="new-password"
          onSubmit={this.handleCreate}
        >
          <section
            className="mdl-color--white mdl-shadow--2dp"
            style={boxStyle}
          >
            <div style={headerStyle}>
              <h4 style={h4}>Informations needed</h4>
              <div style={secText}>
                Please provide the following information. Don&apos;t worry. You
                can always change them later.
              </div>
              <div>
                <TextField
                  id="create-assistant-name"
                  onChange={this.createChangeHandler("name")}
                  defaultValue={name}
                  label="Assistant name"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <TextField
                  id="create-assistant-username"
                  onChange={this.createChangeHandler("username")}
                  defaultValue={username}
                  label="Username"
                  autoComplete="new-password"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <TextField
                  id="create-assistant-password"
                  onChange={this.createChangeHandler("password")}
                  defaultValue={password}
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <TextField
                  id="create-assistant-email"
                  type="email"
                  onChange={this.createChangeHandler("email")}
                  defaultValue={email}
                  label="Your email"
                  style={{ width: "400px" }}
                  required
                />
              </div>
              <div>
                <Select
                  label="Choose language"
                  onSelected={this.handleLanguageChange}
                  style={{ width: "400px" }}
                  required
                >
                  <MenuItem selected={this.state.language === "en"} value="en">
                    English
                  </MenuItem>
                  <MenuItem selected={this.state.language === "fr"} value="fr">
                    French
                  </MenuItem>
                </Select>
              </div>
            </div>
          </section>
          <section style={boxStyle}>
            <Button type="submit" raised>
              Let&apos;s go
            </Button>
            <Button type="button" style={advancedStyle}>
              Advanced settings
            </Button>
          </section>
        </form>
      </div>
    );
  }
}

CreateAssistantBase.defaultProps = {
  error: null,
};

CreateAssistantBase.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  createBot: PropTypes.func.isRequired,
  appSetTitle: PropTypes.func.isRequired,
  history: PropTypes.shape({ length: PropTypes.number, push: PropTypes.func })
    .isRequired,
};

const mapStateToProps = (state) => {
  const { admin, error } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app.loading || false;
  return {
    admin,
    isLoading,
    isSignedIn,
    error,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createBot: (botParams) => {
    dispatch(apiCreateBot(botParams));
  },
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateAssistantBase),
);
