import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { withRouter } from "react-router";
import Header from "../layout/header";
import SideBar from "../layout/sidebar";
import {BACKEND_URL} from '../../global/config'
 
class Profile extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);
    
    this.state = {
        name: "",
        phonenumber: "",
        selectedFileName:'',
        photos:[],
        errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  // This will get the record based on the id from the database.
  componentDidMount() {
    const thisuser = this.props.auth.user;
    axios
      .get(`${BACKEND_URL}/record/${thisuser.id}`)
      .then((response) => {
        this.setState({
          name: response.data.name,
          phonenumber: response.data.phonenumber,
          photos : response.data.photoName?[{filename : response.data.photoName}]:[]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  editClose() {
    window.location.href='/tokenbuy'
  }
 
  // These methods will update the state properties.
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onChangeFile = e => {
      
      this.setState({selectedFileName : e.target.files[0].name})
      const data = new FormData();
      data.append('file', e.target.files[0]);

      axios.post(`${BACKEND_URL}/uploadphoto`, data)
      .then((res) => {
        // this.setState({ photos: [res.data, ...this.state.photos] });
        console.log(res.data)
        this.setState({ photos: [res.data] });
      });
    };
 
  // This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();
    const thisuser = this.props.auth.user;
    const newEditedperson = {
      name: this.state.name,
      phonenumber: this.state.phonenumber,
      photoName : this.state.photos[0].filename
    };
    console.log(newEditedperson);
 
    // This will send a post request to update the data in the database.
    axios
      .post(
        `${BACKEND_URL}/update/${thisuser.id}`,
        newEditedperson
      )
      .then((res) => {
            alert('Your profile have been successfully updated! Please log out and relog in.' )
            window.location.href = '/profile';
        });
  }
 
  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
        <div>
            <Header />
            <SideBar />
            <div className="container-fluid content-inner pb-0" style={{minHeight:680, maxWidth:'90%', paddingLeft:'19%', paddingTop:245, margin:'auto'}}>
              <div className="row">
                  <div className="col-sm-9" style={{margin:'auto'}}>
                      <div className="card" style={{paddingBottom:35}}>
                          <div className="card-header" style={{paddingBottom:45}}>
                              <h4 className="card-title text-white"> {this.state.name}'s Profile</h4>
                          </div>
                          <div className="d-flex mt-3 ms-4 me-4 justify-content-between">
                              <form onSubmit={this.onSubmit} style={{width:'100%'}}>
                                  <div className="modal-content">
                                      <div className="modal-body">
                                          <div className="form-floating mb-4">
                                              <input type="text" className="form-control" id="name" placeholder="User Name" onChange={this.onChange} value={this.state.name}/>
                                              <label>User Name</label>
                                          </div>
                                          <div className="form-floating mb-4">
                                              <input type="text" className="form-control" id="phonenumber" placeholder="Phone Number" onChange={this.onChange} value={this.state.phonenumber}/>
                                              <label>Phone Number</label>
                                          </div>
                                          <div className="form-floating mb-4">
                                              <input type="file" className="form-control" id="avatar" placeholder="Photo" onChange={this.onChangeFile}/>
                                              {this.state.photos.map((photo, index) => (
                                                <div style={{margin:'auto'}} key={'div-'+index}>
                                                  <img src={`${BACKEND_URL}/${photo.filename}`} style={{width:'40%', borderRadius:10}} key={index}/>
                                                </div>
                                              ))}
                                          </div>
                                      </div>
                                      <div className="modal-footer">
                                          <button type="button" className="btn btn-secondary" onClick={this.editClose}>Close</button>
                                          <button type="submit" className="btn btn-primary">Save</button>
                                      </div>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
            </div> 
        </div>
    );
  }
}
 
// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our records.
 
Profile.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    records: state.records
});

export default connect(
    mapStateToProps
)(Profile);
