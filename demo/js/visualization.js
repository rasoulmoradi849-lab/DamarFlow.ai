// ============================================================
// DamarFlow PINN Visualization
// ONNX Runtime Web + Plotly
// ============================================================


function visualizeMineral(output){


    console.log("Visualization output:");
    console.log(output);



    // ========================================================
    // Extract ONNX tensor correctly
    // ========================================================

    let tensor;


// Case 1:
// visualizeMineral(prediction)

if(output.cpuData){

    tensor = output;

}


// Case 2:
// visualizeMineral({prediction: prediction})

else if(output.prediction){

    tensor = output.prediction;

}


else{

    console.error(
        "Received output:",
        output
    );


    throw new Error(
        "Invalid PINN output format"
    );

}



    let values = tensor.cpuData;


    console.log(
        "Prediction length:",
        values.length
    );


    console.log(
        "Tensor dimensions:",
        tensor.dims
    );



    // ========================================================
    // Tensor dimensions
    // ========================================================

    const nx = 100;
    const ny = 100;

    const nVariables = 13;



    /*
        Variable order from PINN output

        0  Fo90
        1  Lizardite
        2  Magnetite
        3  Brucite
        4  Mg2+
        5  Fe2+
        6  SiO2
        7  H+
        8  H2
        9  ...
        10 ...
        11 ...
        12 ...

    */



    // Choose variable to display

    const variableIndex = 0;   // Fo90



    let mineral=[];



    for(let j=0;j<ny;j++){


        let row=[];


        for(let i=0;i<nx;i++){


            let cell =
            j*nx+i;


            let index =
            cell*nVariables
            +
            variableIndex;



            row.push(
                values[index]
            );


        }


        mineral.push(row);


    }



    console.log(
        "Heatmap size:",
        mineral.length,
        mineral[0].length
    );



    // ========================================================
    // Plot
    // ========================================================


    let plotDiv =
    document.getElementById(
        "mineralPlot"
    );


    if(!plotDiv){

        console.error(
            "mineralPlot div not found"
        );

        return;

    }



    let trace={


        z:mineral,

        type:"heatmap",

        colorscale:"Viridis",

        colorbar:{

            title:"Fo90 fraction"

        }


    };



    let layout={


        title:
        "DamarFlow PINN Prediction - Fo90",


        xaxis:{

            title:"X grid"

        },


        yaxis:{

            title:"Y grid"

        },


        height:700


    };



    Plotly.newPlot(

        "mineralPlot",

        [trace],

        layout

    );


}
