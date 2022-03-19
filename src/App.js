import { useState } from "react";
import firebase from "./firebase";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

export const App = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState(null);
    const [status, setStatus] = useState(false);
    const [userInput, setUserInput] = useState("");

    // const sendOTP = (e) => {
    //     // e.preventDefault();
    //     // let options = {
    //     //     method: "POST",
    //     //     url: "https://d7-verify.p.rapidapi.com/send",
    //     //     headers: {
    //     //         "content-type": "application/json",
    //     //         authorization: "Token 711c0b37ba62ddd43c02a8e5b01e3009b79983f7",
    //     //         "x-rapidapi-host": "d7-verify.p.rapidapi.com",
    //     //         "x-rapidapi-key":
    //     //             "f4197329bfmsh4fdabd15dca59f0p127666jsn5f72725f3e21",
    //     //     },
    //     //     data: {
    //     //         expiry: 900,
    //     //         message: `Hey ${name}, Your OTP is {code}`,
    //     //         mobile: number,
    //     //         sender_id: "SMSInfo",
    //     //     },
    //     // };

    //     // try {
    //     //     axios
    //     //         .request(options)
    //     //         .then((response) => {
    //     //             console.log(response.data);
    //     //             if (response.data.status === "open") {
    //     //                 setStatus(true);
    //     //             }
    //     //         })
    //     //         .catch((error) => {
    //     //             console.log(error);
    //     //         });
    //     // } catch (error) {
    //     //     console.log(error);
    //     // }
    //     let recaptcha = new firebase.auth.RecaptchaVerifier(
    //         "recaptcha-container"
    //     );
    //     firebase
    //         .auth()
    //         .signInWithPhoneNumber(number, recaptcha)
    //         .then((response) => {
    //             let code = prompt("enter OTP");
    //             if (code === null) {
    //                 return;
    //             }
    //             e.confirm(code)
    //                 .then((response) => {
    //                     console.log(response);
    //                 })
    //                 .catch((error) => {
    //                     console.log(error);
    //                 });
    //         });
    // };

    const configureCaptcha = () => {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier(
            "sign-in-button",
            {
                size: "invisible",
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    onSignInSubmit();
                    console.log("recaptcha verified");
                },
            },
            auth
        );
    };

    const onSignInSubmit = (e) => {
        e.preventDefault();
        configureCaptcha();
        const phoneNumber = number;
        console.log(phoneNumber);

        const appVerifier = window.recaptchaVerifier;

        const auth = getAuth();
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log("otp has been sent", confirmationResult);
                if (confirmationResult) setStatus(true);
            })
            .catch((error) => {
                console.log("sms not sent", error);
            });
    };

    const onSubmitOTP = (e) => {
        e.preventDefault();
        const code = userInput;
        window.confirmationResult
            .confirm(code)
            .then((result) => {
                // User signed in successfully.
                const user = result.user;
                console.log(JSON.stringify(user), result);
                alert("User is verified");
                setStatus(false)
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
    };

    const handleOTP = (e) => {
        setUserInput(e.target.value);
    };

    if (status) {
        return (
            <div className="m-32 flex justify-center">
                <div className="bg-red-700  p-16 space-y-8">
                    <form
                        className="space-y-8"
                        onSubmit={(e) => onSubmitOTP(e)}
                    >
                        <input
                            type="number"
                            name="otp"
                            placeholder="Enter Your OTP"
                            onChange={(e) => handleOTP(e)}
                            className="w-full rounded-full ring-1 ring-green-400 outline-none py-2 px-4"
                        />
                        <button
                            type="submit"
                            value="verify OTP"
                            className="w-full rounded-full bg-green-700 outline-none py-2 px-4"
                        >
                            Verify OTP
                        </button>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="m-32 flex justify-center">
                <div className="bg-red-700  p-16 space-y-8">
                    <form
                        className="space-y-8"
                        onSubmit={(e) => onSignInSubmit(e)}
                    >
                        <div id="sign-in-button"></div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={(e) => handleNameChange(e)}
                            className="w-full rounded-full ring-1 ring-green-400 outline-none py-2 px-4"
                        />
                        <input
                            type="tel"
                            name="phone-number"
                            placeholder="example: +8801784644363"
                            onChange={(e) => handleNumberChange(e)}
                            className="w-full rounded-full ring-1 ring-green-400 outline-none py-2 px-4"
                        />
                        <button
                            type="submit"
                            className="w-full rounded-full
                        bg-green-700 outline-none py-2 px-4"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
};
