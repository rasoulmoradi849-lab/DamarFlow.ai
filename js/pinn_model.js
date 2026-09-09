// ============================================================
// DamarFlow PINN Model Interface
// ONNX Runtime Web
// ============================================================


let pinn_session = null;


// ============================================================
// Load ONNX Model
// ============================================================

async function loadPINN(){

    const resultDiv =
    document.getElementById("result");


    try{

        resultDiv.innerHTML =
        "<b>Loading PINN model...</b>";


        console.log("Loading PINN...");


        pinn_session =
        await ort.InferenceSession.create(
            "models/serpentinization_pinn.onnx"
        );


        console.log(
            "PINN loaded successfully."
        );


        console.log(
            "Input Names:",
            pinn_session.inputNames
        );


        console.log(
            "Output Names:",
            pinn_session.outputNames
        );


        resultDiv.innerHTML =
        "<span style='color:lime'>✔ PINN Loaded</span>";

    }


    catch(err){

        console.error(err);


        resultDiv.innerHTML =
        "<span style='color:red'>PINN Load Failed</span>";

    }

}



// ============================================================
// Run PINN Prediction
// ============================================================


async function runPINN(T,t){


    if(!pinn_session){

        throw new Error(
            "PINN not loaded"
        );

    }



    const nx=100;
    const ny=100;


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

        [
            nx*ny,
            4
        ]

    );



    console.log(
        "Running PINN..."
    );



    const feeds={};


    feeds[
        pinn_session.inputNames[0]
    ] = tensor;



    const outputs =
    await pinn_session.run(
        feeds
    );



    console.log(
        "Inference complete.",
        outputs
    );



    const outName =
    pinn_session.outputNames[0];



    const predictionTensor =
    outputs[outName];



    console.log(
        "Prediction tensor:",
        predictionTensor
    );



    // =====================================================
    // Convert ONNX Tensor -> JavaScript Array
    // =====================================================


    const raw =
    predictionTensor.cpuData;



    const dims =
    predictionTensor.dims;



    console.log(
        "Prediction dimensions:",
        dims
    );



    const nCells =
    dims[0];


    const nOutputs =
    dims[1];



    let prediction=[];



    for(let i=0;i<nCells;i++){


        let cell={};


        for(let j=0;j<nOutputs;j++){


            cell[
                "var"+j
            ] =
            raw[
                i*nOutputs+j
            ];


        }


        prediction.push(cell);


    }



    console.log(
        "Converted prediction:",
        prediction
    );



    return {

        nx:nx,

        ny:ny,

        data:prediction

    };


}
