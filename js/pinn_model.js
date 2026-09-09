// ============================================================
// DamarFlow PINN Model Interface
// ONNX Runtime Web
// ============================================================


let pinn_session = null;


// ============================================================
// Load ONNX PINN Model
// ============================================================

async function loadPINN(){


    const resultDiv =
    document.getElementById("result");


    try{


        resultDiv.innerHTML =
        "<b>Loading PINN model...</b>";


        console.log(
            "Loading PINN..."
        );



        pinn_session =
        await ort.InferenceSession.create(

            "demo/model/serpentinization_pinn.onnx",

            {

                executionProviders:[
                    "wasm"
                ]

            }

        );



        console.log(
            "PINN loaded successfully."
        );


        console.log(
            "Input Names:"
        );

        console.log(
            pinn_session.inputNames
        );


        console.log(
            "Output Names:"
        );

        console.log(
            pinn_session.outputNames
        );



        resultDiv.innerHTML =

        `
        <span style="color:#55d6e8">
        ✔ PINN model loaded successfully
        </span>
        `;



    }


    catch(err){


        console.error(
            "PINN loading failed"
        );


        console.error(err);



        resultDiv.innerHTML =

        `
        <span style="color:red">
        ❌ PINN loading failed
        <br>
        ${err.message}
        </span>
        `;


    }


}





// ============================================================
// Run PINN Prediction
// Input:
// T = temperature
// t = reaction time
//
// Generates complete 100x100 field
// ============================================================


async function runPINN(T,t){



    if(
        pinn_session===null
    ){

        throw new Error(
            "PINN model not loaded."
        );

    }



    const nx = 100;
    const ny = 100;



    let input = [];



    /*
       Input order from ONNX:

       xytT

       [x,y,t,T]

    */


    for(
        let j=0;
        j<ny;
        j++
    ){


        for(
            let i=0;
            i<nx;
            i++
        ){



            let x =
            5.17*i/(nx-1);



            let y =
            5.17*j/(ny-1);



            input.push(

                x,
                y,
                t,
                T

            );


        }

    }





    const inputTensor =

    new ort.Tensor(

        "float32",

        Float32Array.from(input),

        [

            nx*ny,
            4

        ]

    );




    console.log(
        "Running PINN..."
    );



    let outputs;



    try{


        outputs =

        await pinn_session.run(

            {


                xytT:
                inputTensor


            }

        );


    }


    catch(err){


        console.error(
            "PINN inference error"
        );


        console.error(err);


        throw err;


    }




    console.log(
        "Inference complete."
    );


    console.log(
        outputs
    );




    // ========================================================
    // Extract output tensor automatically
    // ========================================================


    const outputName =

    pinn_session.outputNames[0];



    const prediction =

    outputs[outputName];



    console.log(
        "Prediction tensor:"
    );


    console.log(
        prediction
    );





    // ========================================================
    // Return clean object
    // ========================================================


    return {


        prediction:
        prediction,


        data:
        prediction.cpuData,


        dims:
        prediction.dims,


        size:
        prediction.size


    };



}
