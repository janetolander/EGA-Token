import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../assets/css/common.css";

import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import tokenLogo from "../../assets/images/gahCion.png"

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            phonenumber: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            // this.props.history.push("/");
            window.location.href = '/home'
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

  handleSubmit = async e => {
    e.preventDefault();
   
    const newUser = {
        name: this.state.name,
        phonenumber:this.state.phonenumber,
        password: this.state.password,
        password2: this.state.password2,
      };
      this.props.registerUser(newUser, this.props.history);
  }
  render(){
    return(
        <div style={{backgroundColor:'#2e2f42'}}>
            <div className="wrapper">
            <section className="vh-100 bg-image">
                <div className="container h-100">
                    
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-md-6 mt-5">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row justify-content-center h-100 align-items-center">
                                        <img src={tokenLogo} style={{width:"40%"}}/>
                                    </div>
                                    <div className="auth-form">
                            
                                        <h2 className="text-center mb-4">Sign Up</h2>
                                        <form onSubmit={this.handleSubmit}>
                                            
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="name" placeholder="Full Name" onChange={this.onChange}/>
                                                <label>Full Name</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="phonenumber" placeholder="Phone Number" onChange={this.onChange}/>
                                                <label>Phone Number</label>
                                            </div>
                                            <div className="form-floating mb-2">
                                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.onChange}/>
                                                <label>Password</label>
                                            </div>
                                            <div className="form-floating mb-2">
                                                <input type="password" className="form-control" id="password2" placeholder="Confirm Password" onChange={this.onChange}/>
                                                <label>Confirm Password</label>
                                            </div>
                                            
                                            <div className="align-items-center flex-wrap">
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Sign Up</button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="new-account mt-3 text-center">
                                            <p>If you already have your account, <a className="" href="/signin">Click
                                                    here to sign in</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </section>
            </div>
        </div>
    )
  }
}

Signup.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { registerUser }
)(Signup);