import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
const firebase = require("firebase");



class SignupComponent extends React.Component{

    //Creating States for the componenet
    constructor(){
        super();

        this.state = {
            email: null,
            password: null,
            passwordConfirmation: null,
            signupError: ''
        };
    };

    render(){

        const { classes } = this.props;

        return(
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Sign Up!
                    </Typography>
                    <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='sinup-email-input'>Enter Your Email</InputLabel>
                            <Input autoComplete='email' type='email' onChange={(e) => this.userTyping('email',e)} autoFocus id='sinup-email-input'></Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='sinup-password-input'>Enter Your Password</InputLabel>
                            <Input type='password' onChange={(e) => this.userTyping('password',e)} autoFocus id='sinup-password-input'></Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='sinup-password-confirmation-input'>Confirm Your Password</InputLabel>
                            <Input type='password' onChange={(e) => this.userTyping('passwordConfirmation',e)} autoFocus id='sinup-password-confirmation-input'></Input>
                        </FormControl>

                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
                    </form>

                    {
                        this.state.signupError ? 
                        <Typography className={classes.errorText}>
                            {this.state.signupError}
                        </Typography>
                        :
                        null
                    }

                    <h5 className={classes.hasAccountHeader}>Already Have An Account?</h5>
                    <Link className={classes.logInLink} to='/login'>Log In!</Link>
                </Paper>
            </main> 
            );
    };

    isFormValid = () => this.state.password === this.state.passwordConfirmation;

    userTyping = (type, e) => {
        
        switch (type) {
            
            case 'email':
                this.setState({ email: e.target.value });
                break;
            
            case 'password':
                this.setState({ password: e.target.value });
                break;

            case 'passwordConfirmation':
                this.setState({ passwordConfirmation: e.target.value });
                break;
        
            default:
                break;
        }
    };

    submitSignup = (e) => {

        e.preventDefault();

        if(!this.isFormValid()){
            this.setState({ signupError: 'Password do not match!'});
            return;
        }

        //Creating user in the firebase users auth
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(authRes => {
                console.log(authRes);
                const userObj = {
                    email: authRes.user.email
                };

                //Savind data in the firebase database
                firebase
                .firestore()
                .collection('users')
                .doc(this.state.email)
                .set(userObj)
                .then(() => {
                    this.props.history.push('/dashboard')
                }, dbError => {
                    console.log(dbError);
                    this.setState({ signupError: 'Failed to save data..'})
                });
            }, authError => {
                console.log(authError);
                this.setState({ signupError: 'Failed to create user..'})
            });
            
        console.log("Submitting Signup form!!",this.state);
    };
};



export default withStyles(styles)(SignupComponent);