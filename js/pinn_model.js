// ============================================================
// DamarFlow PINN Model Interface
// ONNX Runtime Web
// ============================================================

let pinn_session = null;


// ============================================================
// Load ONNX PINN Model
// ============================================================

async function loadPINN(){

    const resultDiv = document.getElementById("result");

    try{

        resultDiv.innerHTML =
        "<b>Loading PINN model...</b>";

        console.log("Loading PINN...");

        pinn_session = await ort.InferenceSession.create(
            "demo/model/serpentinization_pinn.onnx"
        );

        console.log("PINN loaded successfully.");

        console.log("Input Names:");
        console.log(pinn_session.inputNames);

        console.log("Output Names:");
        console.log(pinn_session.outputNames);

        resultDiv.innerHTML =
        "<span style='color:lime;'>✔ PINN model loaded successfully.</span>";

    }
    catch(err){

        console.error("PINN loading failed");

        console.error(err);

        resultDiv.innerHTML =
        "<span style='color:red;'>❌ Failed to load PINN model.<br>" +
        err.message +
        "</span>";

    }

}



// ============================================================
// Run Prediction
// ============================================================

async function runPINN(T,t){

    if(pinn_session===null){

        throw new Error(
            "PINN model has not been loaded."
        );

    }


    const nx = 100;
    const ny = 100;


    let input=[];


    for(let j=0;j<ny;j++){

        for(let i=0;i<nx;i++){

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


    const tensor =
    new ort.Tensor(

        "float32",

        Float32Array.from(input),

        [nx*ny,4]

    );


    console.log("Running PINN...");

    let outputs;


    try{

        //-----------------------------------------------------
        // Change "xytT" if console shows another input name
        //-----------------------------------------------------

        outputs =
        await pinn_session.run({

            xytT:tensor

        });

    }

    catch(err){

        console.error(err);

        throw err;

    }


    console.log("Inference complete.");

    console.log(outputs);


    //---------------------------------------------------------
    // Automatically obtain first output
    //---------------------------------------------------------

    const outputName =
    pinn_session.outputNames[0];

    return outputs[outputName];

}
