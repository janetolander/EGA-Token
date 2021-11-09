import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { connect } from "react-redux";

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Logo from "../../assets/images/gahCion.png";
import {SERVER_MAIN_URL} from '../../config'

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            phonenumber : '',
            birthday : new Date(),
            nickname : '',
            password: "",
            password2: "",
            userID : '',
            opening:false,
            errors: {}
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this)
    }

    handleOpen () {
        this.setState({opening:true});
    };
    
    handleClose () {
        this.setState({opening:false});
    };

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

    setBirthday = date => {
        this.setState({birthday : date});
        console.log('you selected date is ', date);
    }

    handleSubmit = async e => {
        e.preventDefault();
        console.log('you selected date is ', this.state.birthday)
        const verifyItem = {
            phonenumber : this.state.phonenumber,
            nickname:this.state.nickname,
        };
        axios
        .post(
            `${SERVER_MAIN_URL}/record/verify`, verifyItem)
        .then((res) => {
            console.log('the status of response is ', res)
            if(res.data.resuc == 'success'){
                alert('Your verify is successful! ');
                this.setState({userID: res.data.data.id});
                this.handleOpen()
            }
            if(res.data.resuc == 'failure'){
                alert('You are not registered user.');
            }
        });
    }
    handleModalSubmit(e){
        e.preventDefault();
        
        const resetData = {
            userID : this.state.userID,
            password : this.state.password,
            password2 : this.state.password2
        }
        axios
            .post(`${SERVER_MAIN_URL}/record/resetpassword`, resetData)
            .then(res =>{
                if(res.status == '200'){
                    alert(res.data.message)
                    this.handleClose();
                    window.location.href = '/signin'
                }
                if(res.status == '404'){
                    alert (res.data.message);
                }
            }
                
            ).catch(err =>{
                alert('FAILURE!!!')
                }
            );
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
                                        <img src={Logo} style={{width:"40%"}}/>
                                    </div>
                                    <div className="auth-form">
                            
                                        <h2 className="text-center mb-4">Verify to reset password</h2>
                                        <form onSubmit={this.handleSubmit}>
                                            
                                            <div style={{marginTop:25, marginBottom:25, padding:15, borderRadius:5, border:'1px solid grey'}}>
                                                <h5 style={{color:'grey'}}>To verify when you forget your password...</h5>
                                                <p style={{color:'grey', fontSize:12}}>(You need to verify before reset your password.)</p>
                                                <div style={{paddingBottom:25, paddingTop:25}}>
                                                    <label>What is your registered phone number?</label>
                                                    <input type="text" className="form-control" id="phonenumber" placeholder="Registered phone number" onChange={this.onChange}/>
                                                </div>
                                                {/* <div style={{paddingBottom:25, paddingTop:25}}>
                                                    <label>What is your birthday?</label>
                                                    <DatePicker className="form-control" selected={this.state.birthday} onSelect={(date) => this.setBirthday(date)}/>
                                                </div> */}

                                                <div style={{paddingBottom:25}}>    
                                                    <label>What is your childhood nickname?</label>
                                                    <input type="text" className="form-control" id="nickname" placeholder="Childhood Nickname" onChange={this.onChange}/>   
                                                </div>
                                            </div>
                                            <div className="new-account mt-3 text-center">
                                                <p>If you alrea your account, <a className="" href="/signin">Click here to sign in</a></p>
                                            </div>
                                            
                                            <div className="align-items-center flex-wrap">
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-primary">Verify</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={this.state.opening}
                        onClose={this.handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                        style={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',}}
                    >
                        <Fade in={this.state.opening}>
                            <div style={{width:'55%', backgroundColor:'#262626', color:'white', borderRadius:5, minHeight:450}}>
                                <form style={{width:'100%', margin:'auto'}} onSubmit={this.handleModalSubmit}>
                                    <div className='modal-content' style={{width:'100%', textAlign:'center', margin:'auto', padding:40, minHeight:450, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                                        
                                        <div className='modal-body'>
                                            <div className="form-floating mb-2">
                                                    <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.onChange}/>
                                                    <label>New Password</label>
                                                </div>
                                                <div className="form-floating mb-2">
                                                    <input type="password" className="form-control" id="password2" placeholder="Confirm Password" onChange={this.onChange}/>
                                                    <label>Confirm Password</label>
                                                </div>
                                            </div>
                                        <div className="modal-footer">
                                            <button type="submit" className="btn btn-primary">Reset</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Fade>
                    </Modal>
                </div>
                </section>
            </div>
        </div>
    )
  }
}

ForgotPassword.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
)(ForgotPassword);