import React from 'react';
import request from 'utils/request';
import Router from 'next/router';
import { validateFormData } from 'utils/validations';
import config from 'config';
import SignUp from 'components/views/Auth/SignUp';

import {
  createRequestOptions,
  submitFormData
} from 'utils/helperFuncs';
import cookies from 'utils/cookies';
import Head from 'next/head';
import Meta from 'components/widgets/Meta';
class SignUpPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      loading: false,
      formDetails: {
        name: {
            status: true,
            errorText: '',
            value: '',
            rules: ['isRequired'],
        },
        email: {
          status: true,
          errorText: '',
          value: '',
          rules: ['isRequired', 'isEmail'],
        },
        password: {
          status: true,
          errorText: '',
          value: '',
          rules: ['isRequired', 'PasswordLimitations'],
        },
      },
    }
  }

  updateFormDetails = (formDetails) => {
    this.setState({ formDetails });
  }

  validateForm = (formData) => {
    return validateFormData(formData);
  }

  submitForm = (formDetails) => { // eslint-disable-line no-unused-vars
    const userData = submitFormData(formDetails);
		this.onSignup(userData);
  }


  onSignup = async (data) => {
    this.setState({ success: false, error: false, loading: true });
    const requestBody = { data };
    const requestURL = 'api/signup';
    const options = createRequestOptions('POST', requestBody);
    const response = await request(requestURL, options);
    if(!response.err) {
      this.setState({  loading: false, success: true });
      const user = response.data;
      const tempFormDetails = Object.assign({}, this.state.formDetails);
      tempFormDetails.name.value = '';
      tempFormDetails.email.value = '';
      tempFormDetails.password.value = '';
      this.updateFormDetails(tempFormDetails);
      // Router.push("/");
    } else {
      this.setState({ error: response.err.reason, loading: false });
    }
  }

  componentWillMount() {
    const token = cookies.load('token');
    if(!!token) Router.push('/profile');
  }
  
	render() {
    const { formDetails, error, loading, success } = this.state;
		return (
      <Meta>
        <Head>
          <title>Sign up ~ Cosmic JS React Auth App</title>
        </Head>
        <SignUp 
          formDetails={formDetails}
          error={error}
          success={success}
          loading={loading}

          validateForm={this.validateForm}
          updateFormDetails={this.updateFormDetails}
          submitForm={this.submitForm}
        />
      </Meta>
		);
	}
}

export default SignUpPage;
