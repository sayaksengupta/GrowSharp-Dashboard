import Head from 'next/head';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Facebook as FacebookIcon } from '../icons/facebook';
import { Google as GoogleIcon } from '../icons/google';
import Axios from 'axios';
import { Logo } from '../components/logo'
import { useCookies } from "react-cookie"

const Login = () => {

  const [cookie, setCookie] = useCookies(["jwt"])

  const formik = useFormik({
    initialValues: {
      email: 'admin@gmail.com',
      password: 'admin123'
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    // onSubmit: async () => {
    //   const data = {email : formik.values.email, password : formik.values.password};
    //   await Axios.post('http://localhost:8000/admin/login',data,{withCredentials: true})
    //   .then((res) => {
    //     if(res){
    //     console.log(res);
    //     localStorage.setItem("token",res.data.token);
    //     localStorage.setItem("Admin", JSON.stringify(res.data.admin));
    //     Router
    //     .push('/');
    //     }else{
    //       alert("Invalid Creds !");
    //     }
    //   }).catch(err => {
    //         console.log(err);
    //     }) 
      
    // }
  });

  const loginAdmin = async (e) => {
    e.preventDefault();
    const data = {email : formik.values.email, password : formik.values.password};
      await Axios.post('https://your-corner-backend.herokuapp.com/admin/login',data,{withCredentials: true})
      .then((res) => {    
        console.log(res);
        localStorage.setItem("token",res.data.token);
        setCookie("jwt", res.data.token, {
          path: "/",
          maxAge: 3600, // Expires after 1hr
          sameSite: true,
          })
        localStorage.setItem("Admin", JSON.stringify(res.data.admin));
        Router
        .push('/');
      }).catch((err) => {
            console.log(err);
        }) 
  }

  return (
    <>
      <Head>
        <title>Login | Grow Sharp</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
             <Logo
                  sx={{
                    height: 100,
                    width: 100,
                    
                  }}
                />
                </Box>
          <form>
            {/* <Box sx={{ my: 3 }}> */}
              {/* <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in on the internal platform
              </Typography>
            </Box>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                md={6}
              >
                <Button
                  color="info"
                  fullWidth
                  startIcon={<FacebookIcon />}
                  onClick={() => formik.handleSubmit()}
                  size="large"
                  variant="contained"
                >
                  Login with Facebook
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <Button
                  color="error"
                  fullWidth
                  onClick={() => formik.handleSubmit()}
                  size="large"
                  startIcon={<GoogleIcon />}
                  variant="contained"
                >
                  Login with Google
                </Button>
              </Grid>
            </Grid> */}
            {/* <Box
              sx={{
                pb: 1,
                pt: 3
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="body1"
              >
                or login with email address
              </Typography>
            </Box> */}
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                // disabled={formik.isSubmitting}
                onClick={loginAdmin}
                fullWidth
                size="large"
                // type="submit"
                variant="contained"
              >
                Login
              </Button>
            </Box>
            {/* <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography> */}
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
