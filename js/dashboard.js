// ============================================================
// DamarFlow Dashboard Controller
// User interaction layer
// ============================================================


document.addEventListener(
"DOMContentLoaded",
function(){


    console.log(
        "DamarFlow dashboard initialized"
    );


    const button =
    document.getElementById(
        "runPINN"
    );


    if(button){


        button.addEventListener(
        "click",
        predict
        );


    }


});




// ============================================================
// Main Prediction Function
// ============================================================


async function predict(){


    try{


        let T =

        Number(

        document.getElementById(
        "temperature"
        ).value

        );



        let t =

        Number(

        document.getElementById(
        "time"
        ).value

        );



        console.log(
            "Temperature:",
            T
        );


        console.log(
            "Time:",
            t
        );



        // Run ONNX PINN

        let result =

        await runPINN(

            T,

            t

        );



        console.log(
            "Prediction completed",
            result
        );



        // Send result to visualization

        visualizeMineral(
            result
        );



    }


    catch(error){


        console.error(
            "Prediction error:",
            error
        );


        alert(
            "PINN prediction failed"
        );


    }


}
