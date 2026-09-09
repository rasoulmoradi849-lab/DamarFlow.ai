function visualizeMineral(output, T, t) {


    /*
      ONNX output layout:

      column 0-8:
          aqueous species

      column 9:
          Fo90

      column 10:
          Lizardite

      column 11:
          Magnetite

      column 12:
          Brucite
    */


    let prediction;


    // Case 1:
    // onnxruntime-web returns object

    if(output.prediction){

        prediction = output.prediction.data;

    }


    // Case 2:
    // direct tensor array

    else if(output.data){

        prediction = output.data;

    }


    else{

        console.error(
            "Invalid ONNX output",
            output
        );

        return;

    }



    let field=[];


    const nx=100;
    const ny=100;


    for(let j=0;j<ny;j++){


        let row=[];


        for(let i=0;i<nx;i++){


            let index =
                j*nx+i;


            /*
              Each grid point has 13 outputs

              [H+,Mg++,Fe++,O2,SiO2,
               Na,Cl,HCO3,Tracer,
               Fo90,Lizardite,
               Magnetite,Brucite]

            */


            let mineralIndex =
                index*13 + 9;



            row.push(
                prediction[mineralIndex]
            );


        }


        field.push(row);

    }




    let data=[

        {

            z:field,

            type:"heatmap",

            colorscale:"Viridis",

            colorbar:{

                title:
                "Fo90 volume fraction"

            }

        }

    ];



    Plotly.newPlot(

        "result",

        data,

        {


            title:
            "Fo90 Prediction | T="
            +T+
            " °C , t="
            +t+
            " h",



            xaxis:{

                title:
                "x (cm)"

            },


            yaxis:{

                title:
                "y (cm)"

            },


            width:700,

            height:600

        }


    );


}
