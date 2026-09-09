function visualizeMineral(output,T,t){


console.log("Visualization output:",output);


// Get ONNX output

let prediction =
output.prediction.cpuData;



console.log(
"Prediction length:",
prediction.length
);



// Number of predicted fields

let nFields = 13;

let nx = 100;
let ny = 100;



// Select Fo90 field

let fieldIndex = 0;



let field=[];



for(let j=0;j<ny;j++){


    let row=[];


    for(let i=0;i<nx;i++){


        let index =
        fieldIndex*nx*ny
        +
        j*nx
        +
        i;


        row.push(
            prediction[index]
        );


    }


    field.push(row);

}




Plotly.newPlot(

"mineralPlot",

[

{

z:field,

type:"heatmap",

colorscale:"Viridis",

colorbar:{
title:"Fo90"
}


}

],


{


title:
"Fo90 Prediction | T="
+T+
" °C | t="
+t+
" h",


xaxis:{
title:"x (cm)"
},


yaxis:{
title:"y (cm)"
}


}


);


}
