import React, { useContext, useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import hacker from "../pics/hacker.jpg"
import hacker2 from "../pics/hacker2.jpg"
import hacker3 from "../pics/hacker3.jpg"
import logo from "../pics/logo.png";


const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);  // Get login state
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            const storedUsername = localStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
            }
        } else {
            setUsername("");
        }
    }, [isLoggedIn]);

    return (
        <div className={styles.container1}>
            <div className={styles.body1}>
                <div className={styles.tagwrapper}>
                    <h1 className={styles.heading}>Welcome to Cyber-Ops!!!</h1>
                </div>
                
                {isLoggedIn && username ? (
                    <>
                        {/* <div className={styles.h3container}> */}
                        <h3 className={styles.descriptionbuddy}>
                             <h2>  Welcome , {username}! 🚀 </h2>
                            We will help you find out if that URL you are using a bit too often is safe for you or  <br />
                            if you shouldn't trust it with your sensitive data. <br />
                            <br></br>
                           
                        </h3>
                        <div className="userbutton">
                            <div className={styles.optionsbutton}>
                                <button onClick={() => navigate("/result")} className={styles.button1}>Check URL!</button>
                                
                            </div>
                        </div>

                    </>

                ) : (
                    <>
                        <div className={styles.h3conatiner}>
                            <h3 className={styles.descriptionbuddy}>
                                We will help you find out if that URL you are using a bit too often is safe for you or  <br />
                                if you shouldn't trust it with your sensitive data. <br />
                                <br></br>
                                Just SIGN UP and let's get started!
                            </h3>
                        </div>
                        <div className="userbutton">
                            <div className={styles.optionsbutton}>
                                <button onClick={() => navigate("/login")} className={styles.button1}>LOGIN</button>
                                <button onClick={() => navigate("/signup")} className={styles.button1}>SIGN-UP</button>
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.masterinfo}>

                <div className={styles.infosection}>
                    <div className={styles.infocard}>
                        <div>
                            <img src={hacker} alt="Shield" className={styles.infoicon} />
                        </div>
                        <div className={styles.infotext}>
                            <h2>What is Phishing?</h2>
                            <p>Phishing is a common type of cyber attack where attackers attempt to deceive individuals into revealing sensitive information, such as passwords, credit card numbers, or personal details.  Phishing can occur through emails, text messages, social media, or fake websites that closely mimic legitimate ones. 
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.infosection2}>
                    <div className={styles.infocard2}>
                       
                        <div className={styles.infotext2}>
                            <h2>Why is Phishing Dangerous?</h2> 
                            <ul style={{ listStyleType: 'disc', marginLeft: '2vw' }}>

                                <li>Identity theft</li>
                                <li>Financial loss</li>
                                <li>Compromise of personal and professional data</li>
                                <li>Unauthorized access to bank accounts</li>
                                <li>Malware installation</li>
                            </ul> 
                        </div>
                        <div>
                            <img src={hacker2} alt="Shield" className={styles.infoicon2} />
                        </div>
                </div>
                </div>
                {/* <div className={styles.infosection3}>
                    <div className={styles.infocard}>
                        <div className={styles.infotext}>
                            <h2>How CyberOps Helps You?</h2>
                            <p>CyberOps uses advanced URL analysis to determine if a website is safe to use.Protect yourself from cyber threats and browse the internet with confidence — all with just a few clicks. Just sign up, enter the URL you want to check, and stay protected!
                            </p>
                        </div>
                        <div className={styles.imageContainer}>
                            <img src={hacker3} alt="Shield" className={styles.infoicon} />
                        </div>
                    </div>
                </div> */}
                </div>

            </div>
        </div>



    );
};

export default Home;
