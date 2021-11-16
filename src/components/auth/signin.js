import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "../../assets/css/common.css";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import tokenLogo from "../../assets/images/gahCion.png"

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            phonenumber: "+",
            password: "",
            opening : false,
            showWarningMessage : 'none',
            disbaledBTN:'',
            errors: {}
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            window.location.href = '/home'
        } else {
            this.handleOpen();
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

    handleOpen () {
        this.setState({opening:true});
      };

    handleClose () {
        this.setState({opening:false});
      };

    handleSubmit = async e => {
        e.preventDefault();
    
        const credential = {
            phonenumber: this.state.phonenumber,
            password: this.state.password,
        };
        this.props.loginUser(credential);
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
                                                    <button type="submit" className="btn btn-primary" disabled={this.state.disbaledBTN}>Sign In</button>
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
                  <div style={{width:'50%', backgroundColor:'#262626', color:'white', borderRadius:5, minHeight:450}}>
                    <form style={{width:'100%', margin:'auto'}} onSubmit={this.handleModalSubmit}>
                        <div className='modal-content' style={{width:'100%', textAlign:'center', margin:'auto', padding:40, minHeight:450, borderRadius:5, maxHeight:600, overflowY:'scroll'}}>
                            <div>
                              <h2>Hello visitors.</h2>
                            </div>
                            <div className='modal-body'>
                                <p>We are not experts or professionals in internet economics, cryptocurrency or any investment in electronic money.</p>
                                <p>We are just a club of investors who have set up through this site a blockchain system to tokenize activities and share the gains with the members of the club.</p>
                                <p>All those who register on this site are automatically part of the clubs.</p>
                                <br/>
                                <br/>
                                <p>We do not promise you any miracle winnings whatsoever.</p>
                                <p>By clicking to enter you agree to be of legal age, to have all your mental faculties and to be responsible for all possible gains and losses linked to your transactions here.</p>
                                <p>We thus owed all responsibilities related to your current and future investments.</p>
                                <p>If you join then you can subscribe.</p>
                            </div>
                            <div className="modal-footer">
                             
                            </div>
                          </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
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