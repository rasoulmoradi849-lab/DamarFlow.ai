// ============================================================
// DamarFlow PINN Model Interface
// ONNX Runtime Web
// Serpentinization Reactive Transport Surrogate
// ============================================================


let pinn_session = null;


// ============================================================
// ONNX Model Path
// ============================================================

const PINN_MODEL_PATH =
    "demo/model/serpentinization_";


// ============================================================
// Output Variable Mapping
// Must match training order
// ============================================================


const PINN_OUTPUTS = [

    "Fo90",
    "Lizardite",
    "Magnetite",
    "Brucite",

    "Mg2",
    "Fe2",

    "SiO2",
    "H_plus",

    "H2",

    "OH",

    "Porosity",

    "Temperature",

    "Pressure"

];



// ============================================================
// Load PINN ONNX Model
// ============================================================


async function loadPINN(){


    try{


        console.log(
            "Loading DamarFlow PINN..."
        );


        pinn_session =
        await ort.InferenceSession.create(

            PINN_MODEL_PATH,

            {

                executionProviders:
                [
                    "wasm"
                ]

            }

        );



        console.log(
            "PINN model loaded."
        );


        console.log(
            "Inputs:",
            pinn_session.inputNames
        );


        console.log(
            "Outputs:",
            pinn_session.outputNames
        );



        const result =
        document.getElementById("result");


        if(result){

            result.innerHTML =
            `
            <span style="
            color:#55d6e8">
            ✔ DamarFlow PINN Loaded
            </span>
            `;

        }


        return true;


    }


    catch(error){


        console.error(
            "PINN loading failed:",
            error
        );


        const result =
        document.getElementById("result");


        if(result){

            result.innerHTML =
            `
            <span style="
            color:#ff8e7a">
            ✘ PINN Loading Failed
            </span>
            `;

        }


        return false;

    }

}



// ============================================================
// Run PINN Field Prediction
//
// Input:
// x,y,t,T
//
// Output:
// 100x100 reactive transport field
//
// ============================================================


async function runPINN(

    temperature,

    time

){



    if(!pinn_session){


        await loadPINN();


    }



    if(!pinn_session){


        throw new Error(
            "PINN session unavailable"
        );


    }



    // --------------------------------------------------------
    // Domain
    // 5.17 cm × 5.17 cm
    // 100 × 100 grid
    // --------------------------------------------------------


    const nx = 100;

    const ny = 100;



    let input = [];



    for(let j=0;j<ny;j++){



        for(let i=0;i<nx;i++){



            const x =
            5.17*i/(nx-1);



            const y =
            5.17*j/(ny-1);



            /*
              IMPORTANT

              ONNX INPUT ORDER:

              [x,y,time,temperature]

            */


            input.push(

                x,

                y,

                time,

                temperature

            );


        }


    }





    // --------------------------------------------------------
    // Create ONNX tensor
    // --------------------------------------------------------


    const tensor =

    new ort.Tensor(

        "float32",

        new Float32Array(input),

        [

            nx*ny,

            4

        ]

    );





    const feeds = {};



    feeds[
        pinn_session.inputNames[0]
    ] = tensor;




    console.log(
        "Running PINN inference..."
    );



    const outputs =

    await pinn_session.run(

        feeds

    );





    const outputName =

    pinn_session.outputNames[0];



    const predictionTensor =

    outputs[outputName];




    console.log(

        "Output dimensions:",

        predictionTensor.dims

    );





    // ========================================================
    // Convert tensor
    // Shape:
    //
    // [10000,13]
    //
    // ========================================================


    const raw =

    predictionTensor.data;



    const cells =

    predictionTensor.dims[0];



    const variables =

    predictionTensor.dims[1];





    let field = [];





    for(let i=0;i<cells;i++){



        let cell = {};



        for(let j=0;j<variables;j++){



            let name =

            PINN_OUTPUTS[j]

            ||
            "Output_"+j;




            cell[name] =

            raw[
                i*variables+j
            ];



        }



        field.push(cell);



    }





    console.log(

        "PINN field generated:",

        field

    );





    return {


        nx:nx,


        ny:ny,


        temperature:temperature,


        time:time,


        data:field


    };



}







// ============================================================
// Utility:
// Get one variable as 100x100 matrix
// For Plotly heatmaps
// ============================================================



function extractField(

    prediction,

    variable

){



    let matrix=[];



    for(let j=0;j<prediction.ny;j++){


        let row=[];



        for(let i=0;i<prediction.nx;i++){



            let id =

            j*prediction.nx+i;



            row.push(

                prediction
                .data[id][variable]

            );


        }


        matrix.push(row);


    }



    return matrix;


}
