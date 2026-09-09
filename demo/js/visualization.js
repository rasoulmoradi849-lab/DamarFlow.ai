// ============================================================
// DamarFlow Mineral Visualization
// Plotly Heatmap
// ============================================================


function visualizeMineral(result){


    console.log(
        "Visualization output:",
        result
    );



    const data =
    result.values;



    const nx =
    result.nx;


    const ny =
    result.ny;



    console.log(
        "Prediction length:",
        data.length
    );



    //-------------------------------------------------
    // Convert flat array to 2D matrix
    //-------------------------------------------------

    let z=[];


    for(let j=0;j<ny;j++){

        let row=[];


        for(let i=0;i<nx;i++){

            row.push(
                data[j*nx+i]
            );

        }


        z.push(row);

    }



    //-------------------------------------------------
    // Plot
    //-------------------------------------------------

    const plotData=[

        {

            z:z,

            type:"heatmap",

            colorscale:"Viridis"

        }

    ];



    const layout={


        title:
        "PINN Mineral Prediction",


        xaxis:
        {
            title:"X (cm)"
        },


        yaxis:
        {
            title:"Y (cm)"
        }


    };



    Plotly.newPlot(

        "mineralPlot",

        plotData,

        layout

    );


}
