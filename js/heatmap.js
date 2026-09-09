// ============================================================
// DamarFlow Heatmap Renderer
// Plotly Scientific Visualization
// ============================================================



function createHeatmap(

    matrix,

    title,

    container

){



    Plotly.newPlot(

        container,

        [


        {


            z:matrix,


            type:"heatmap",


            colorscale:"Viridis",


            colorbar:{


                title:title


            }


        }


        ],


        {


            title:title,


            xaxis:{


                title:"X grid"

            },


            yaxis:{


                title:"Y grid"


            },


            margin:{


                t:60


            }


        },


        {


            responsive:true


        }


    );



}






// ============================================================
// Mineral field dashboard
// ============================================================



function createMineralDashboard(result){



    let H2 =

    extractField(

        result,

        "H2"

    );



    let Magnetite =

    extractField(

        result,

        "Magnetite"

    );



    let Lizardite =

    extractField(

        result,

        "Lizardite"

    );



    let Porosity =

    extractField(

        result,

        "Porosity"

    );





    createHeatmap(

        H2,

        "H₂ Generation",

        "H2Plot"

    );



    createHeatmap(

        Magnetite,

        "Magnetite Formation",

        "MagnetitePlot"

    );



    createHeatmap(

        Lizardite,

        "Lizardite Formation",

        "LizarditePlot"

    );



    createHeatmap(

        Porosity,

        "Porosity Evolution",

        "PorosityPlot"

    );



}
