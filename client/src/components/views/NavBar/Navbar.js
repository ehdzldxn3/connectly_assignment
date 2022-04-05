import React, {Component, useEffect, useState, } from 'react'
import { useStyles, } from '../Styles/NavbarStyles'
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Button } from "@material-ui/core";
import { Upload, Search, } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';



function Navbar() {


  //서치태그
  const SearchTAG = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    left: '20%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  //검색 입력칸
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing()})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '50ch',
      },
    },
  }));


  //CSS
  const classes = useStyles();

  //true 로그인 한 상태
  //false 로그인 하지않은 상태
  //화면 체크용
  //리덕스 스토어에 데이터 있는지 체크
  const check = useSelector(state => state.user.userData)
  const auth = check === undefined ? false : check.isAuth


  



  //로그아웃
  const logout = () => {
    axios.get('/api/user/logout')
      .then(response => {
        if (!response.data.success) {
          alert('로그아웃 실패')
        }
      })
  }

    


    return (
      <AppBar className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.typography}>
            <Link to='/' className={classes.link}>
              Youtube
            </Link>
          </Typography>

          <SearchTAG>
            <StyledInputBase
              placeholder="검색"
            />
          </SearchTAG>
          <IconButton className={classes.search}>
            <Search />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <div>
              {auth === false ?
                <div>
                    <Button color="inherit" href='/login'>로그인</Button>
                    <Button color="inherit" href='/register'>회원가입</Button>
                </div>
                :
                <div>
                  <IconButton color='inherit'  href='/video/upload'>
                    <Upload size='large' />
                  </IconButton>
                  <Button color="inherit" href='/' onClick={logout}>로그아웃</Button>
                </div>
              }
            </div>
          </Box>
        </Toolbar>
      </AppBar>

    )
}

export default Navbar