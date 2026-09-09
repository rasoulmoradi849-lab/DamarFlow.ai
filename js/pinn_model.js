// ============================================================
// DamarFlow PINN Model Interface
// ONNX Runtime Web
// ============================================================


let pinn_session = null;


// ============================================================
// Load PINN Model
// ============================================================

async function loadPINN(){

    const resultDiv =
        document.getElementById("result");


    try{

        console.log("Loading PINN model...");


        pinn_session =
        await ort.InferenceSession.create(
            "demo/model/serpentinization_pinn.onnx"
        );


        console.log(
            "PINN loaded successfully."
        );


        console.log(
            "Inputs:",
            pinn_session.inputNames
        );


        console.log(
            "Outputs:",
            pinn_session.outputNames
        );


        resultDiv.innerHTML =
        `
        <span style="color:#00ff00">
        ✔ PINN model loaded
        </span>
        `;


    }

    catch(error){

        console.error(
            "PINN loading failed",
            error
        );


        resultDiv.innerHTML =
        `
        <span style="color:red">
        ❌ PINN loading failed
        </span>
        `;

    }

}





// ============================================================
// Run PINN Prediction
// ============================================================

async function runPINN(T,t){


    if(!pinn_session){

        throw new Error(
            "PINN model not loaded"
        );

    }



    const nx = 100;
    const ny = 100;


    let input =
    new Float32Array(
        nx*ny*4
    );


    let k=0;



    for(let j=0;j<ny;j++){

        for(let i=0;i<nx;i++){


            let x =
            5.17*i/(nx-1);


            let y =
            5.17*j/(ny-1);



            input[k++] = x;
            input[k++] = y;
            input[k++] = t;
            input[k++] = T;


        }

    }



    const tensor =
    new ort.Tensor(

        "float32",

        input,

        [
            nx*ny,
            4
        ]

    );



    console.log(
        "Running PINN..."
    );



    const result =
    await pinn_session.run({

        xytT:tensor

    });



    console.log(
        "Inference complete."
    );

    console.log(
        result
    );



    const outputName =
    pinn_session.outputNames[0];



    const outputTensor =
    result[outputName];



    console.log(
        "Prediction tensor:",
        outputTensor
    );



    //--------------------------------------------------
    // Convert ONNX tensor to normal JS array
    //--------------------------------------------------

    const prediction =
    Array.from(
        outputTensor.cpuData
    );



    console.log(
        "Prediction length:",
        prediction.length
    );



    return {

        values:prediction,

        nx:nx,

        ny:ny

    };


}
