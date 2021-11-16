import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../assets/css/common.css";

import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import tokenLogo from "../../assets/images/gahCion.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            phonenumber: "",
            password: "",
            password2: "",
            birthday : new Date(),
            nickname : '',
            showWarningMessage : 'none',
            disbaledBTN:'',
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
        if(e.target.id == 'phonenumber'){
            let phone_num = e.target.value;
            if(phone_num.substring(0,1) != '+') {
                this.setState({showWarningMessage : ''});
                this.setState({disbaledBTN:'disabled',})
            } else {
                this.setState({showWarningMessage : 'none'});
                this.setState({disbaledBTN:'',})
                this.setState({ phonenumber : phone_num });
            }
        } else this.setState({ [e.target.id]: e.target.value });
    };


    setBirthday = date => {
        this.setState({birthday : date});
        console.log('you selected date is ', date);
    }

  handleSubmit = async e => {
    e.preventDefault();
   
    const newUser = {
        name: this.state.name,
        phonenumber:this.state.phonenumber,
        password: this.state.password,
        password2: this.state.password2,
        birthday : this.state.birthday,
        nickname : this.state.nickname
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
                                                <input type="text" className="form-control" id="phonenumber" placeholder="Phone Number" onChange={this.onChange} value={this.state.phonenumber}/>
                                                <label>Phone Number</label>
                                            </div>
                                            <div>
                                                <p style={{color:'#ff0000', display:this.state.showWarningMessage}} >* Phone Number need to be started with "+" signal.</p>
                                            </div>
                                            <div className="form-floating mb-2">
                                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.onChange}/>
                                                <label>Password</label>
                                            </div>
                                            <div className="form-floating mb-2">
                                                <input type="password" className="form-control" id="password2" placeholder="Confirm Password" onChange={this.onChange}/>
                                                <label>Confirm Password</label>
                                            </div>
                                            <div style={{marginTop:25, marginBottom:25, padding:15, borderRadius:5, border:'1px solid grey'}}>
                                                <h5 style={{color:'grey'}}>To verify when you forget your password...</h5>
                                                <p style={{color:'grey', fontSize:12}}>(If you don't input this data, you wont reset your password when you forgot it.)</p>
                                                <div style={{paddingBottom:25, paddingTop:25}}>
                                                    <label>What is your birthday?</label>
                                                    <DatePicker className="form-control" selected={this.state.birthday} onSelect={(date) => this.setBirthday(date)}/>
                                                </div>

                                                <div style={{paddingBottom:25}}>    
                                                    <label>What is your childhood nickname?</label>
                                                    <input type="text" className="form-control" id="nickname" placeholder="Childhood Nickname" onChange={this.onChange}/>   
                                                </div>
                                            </div>
                                            <div className="align-items-center flex-wrap">
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary" disabled={this.state.disbaledBTN}>Sign Up</button>
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