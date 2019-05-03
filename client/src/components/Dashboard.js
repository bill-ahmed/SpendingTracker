import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import './Dashboard.css';

class HomePage extends Component{

    constructor(props){
        super(props);

        // Bind all functions to "this"
        this.handleUserMenuOpen = this.handleUserMenuOpen.bind(this);
        this.handleUserMenuClose = this.handleUserMenuClose.bind(this);

        this.state = {
            userMenuOpen: {anchorEl: null},
            currUserMenuItem: null,
        }
    }

    handleUserMenuOpen(event){
        this.setState({userMenuOpen: {anchorEl: event.currentTarget}});
    }

    handleUserMenuClose(event, itemSelected){
        this.setState({currUserMenuItem: itemSelected});
        this.setState({userMenuOpen: {anchorEl: null}});

        //If user clicked logout
        if(itemSelected === 'Logout'){
            this.handleLogOut();
        }
    }

    handleLogOut(){
        window.location.href = "/";
    }

    render(){
        // Determine if the user menu is open or not
        const {anchorEl} = this.state.userMenuOpen;
        const open = Boolean(anchorEl);
        return(
            <div className="homePage">
                {/* Dashboard located in the header; controls main navigation */}
                <AppBar position="static" color="default">
                    <Toolbar>
                        <div className="heading">
                            Dashboard
                        </div>

                        <Button variant="text" color="inherit">
                            Home
                        </Button>

                        <IconButton variant="text" onClick={this.handleUserMenuOpen} color="inherit">
                            <Avatar>JD</Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* The Menu Items opened when user clicks on their icon */}
                <Menu anchorEl={anchorEl} open={open} PaperProps={{
                    style: {
                        maxHeight: 220,
                        width: 150,
                        float: 'right',
                    }
                }}>

                    {/* Name of Person */}
                    <ListItem>
                        <ListItemText primary="John Doe"/>
                    </ListItem>

                    <Divider/>

                    <MenuItem onClick={event => this.handleUserMenuClose(event, "Profile")}
                    selected={this.state.currUserMenuItem === "Profile"}>
                        Profile
                    </MenuItem>

                    <MenuItem onClick={event => this.handleUserMenuClose(event, "Settings")}
                    selected={this.state.currUserMenuItem === "Settings"}>
                        Settings
                    </MenuItem>

                    <MenuItem onClick={event => this.handleUserMenuClose(event, "Logout")}
                    selected={this.state.currUserMenuItem === "Logout"}>
                        Logout
                    </MenuItem>
                </Menu>

                <body>
                    <div className="mainContainer">
                        
                    </div>
                </body>
            </div>
        );
    }
}

export default HomePage;