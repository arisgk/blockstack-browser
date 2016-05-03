import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup } from '../../components/index'
import { KeychainActions } from '../../store/keychain'
import { isPasswordValid } from '../../utils/account-utils'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(KeychainActions, dispatch)
}

class CreateAccountPage extends Component {
  static propTypes = {
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      password: '',
      password2: '',
      alerts: []
    }

    this.updateAlert = this.updateAlert.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  createAccount() {
    if (isPasswordValid(this.state.password)) {
      if (this.state.password === this.state.password2) {
        this.updateAlert('success', 'Creating your account...')
        this.props.initializeWallet(this.state.password)
      } else {
        this.updateAlert('danger', 'Passwords must match')
      }
    } else {
      this.updateAlert('danger', 'Password must be at least 8 characters')
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div className="body-inner"
        style={{ backgroundImage: "url('images/profile-collage.jpg')" }}>
      <div className="container out-block-wrap">
        <div className="container-fluid out-block">
          <div className="row">
            <div className="centered">
              <div className="m-b-4">
                <img src="images/ch-bw-rgb-rev.svg" alt="Chord logo" width="60px" />
                <p className="lead-out">browse the blockchain</p>
              </div>
            </div>
            <div>
              <div className="centered">
                <h1 className="text-xs-center type-inverse">create an account</h1>
              </div>
              <div className="out-form-group">
                { this.state.alerts.map(function(alert, index) {
                  return (
                    <Alert key={index} message={alert.message} status={alert.status} />
                  )
                })}
                <InputGroup name="password" type="password" label="Password" inverse={true}
                  placeholder="Password" data={this.state} onChange={this.onValueChange} />
                <InputGroup name="password2" type="password" label="Password (again)" inverse={true}
                  placeholder="Password" data={this.state} onChange={this.onValueChange} />
                <div className="form-group">
                  <fieldset>
                    <div className="col-xs-offset-3 col-xs-8 pull-right m-t-11 m-b-5">
                      <button className="btn btn-block btn-secondary" onClick={this.createAccount}>
                        Create Account
                      </button>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm inverse text-xs-center">
                Already have an account?
                <br />
                <Link to="/account/restore">Restore from backup</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)