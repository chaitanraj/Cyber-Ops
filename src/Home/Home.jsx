import React from "react";
import styles from "./Home.module.css"; 
import {useNavigate} from "react-router-dom";

const Home = () => {
     const navigate=useNavigate(); 
    
     return (
      
        <div className={styles.container1}>  
            <div className={styles.body1}>  
                <div className={styles.tagwrapper}>
                <h1 className={styles.heading}>Welcome to Cyber-Ops!</h1>
                </div>
                <div className={styles.h3conatiner}>
                <h3 className={styles.descriptionbuddy}>
                    We will help you find out if that URL you are using a bit too often is safe for you or  <br />
                    if you shouldn't trust it with your sensitive data. <br />
                    <br></br>
                    Just SIGN UP and let's get started!
                </h3>
                </div>
                <div className={styles.optionsbutton}>  
                    <button onClick={()=>navigate("/login")} className={styles.button1}>LOGIN</button>
                    <button onClick={()=>navigate("/signup")} className={styles.button1}>SIGN-UP</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
