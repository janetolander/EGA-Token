import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "../../assets/css/common.css";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import tokenLogo from "../../assets/images/gahCion.png"

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            // this.props.history.push("/list");
            window.location.href = '/home'
        }
    };

    componentWillReceiveProps(nextProps) {
        // debugger;
        if (nextProps.auth.isAuthenticated) {
            // this.props.history.push("/list");
            window.location.href = '/home'
        }else window.location.href = '/'

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
    
        const credential = {
            phonenumber: this.state.phonenumber,
            password: this.state.password
        };
        this.props.loginUser(credential);
    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
  render() {
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
                            
                                        <h2 className="text-center mb-4">Sign In</h2>
                                        <form onSubmit={this.handleSubmit}>
                                            
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="phonenumber" placeholder="Phone Number" onChange={this.onChange}/>
                                                <label>Phone Number</label>
                                            </div>
                                            <div className="form-floating mb-2">
                                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.onChange}/>
                                                <label>Password</label>
                                            </div>
                                            <div className="d-flex justify-content-between  align-items-center flex-wrap">
                                                <div className="form-group">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"  id="Remember"/>
                                                        <label className="form-check-label">Remember me?</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between  align-items-center flex-wrap">
                                                <div className="form-group">
                                                    <a href="/forgot">Forgot Password?</a>
                                                </div>
                                            </div>
                                            <div className="align-items-center flex-wrap">
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Sign In</button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="new-account mt-3 text-center">
                                            <p>Don't have an account? <a className="" href="/signup">Click
                                                    here to sign up</a></p>
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

Signin.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginUser }
)(Signin);