// ============================================================
// DamarFlow Mineral Visualization
// ============================================================


function visualizeMineral(result){


console.log(
"Visualization output:",
result
);



if(
    !result ||
    !result.data
){

    throw new Error(
        "Invalid PINN output format"
    );

}



const values =
result.data.map(
    d=>d.var0
);



console.log(
"Plot values:",
values.length
);



const plotDiv =
document.getElementById(
    "mineralPlot"
);



if(!plotDiv){

    throw new Error(
        "mineralPlot DIV missing"
    );

}




let z=[];



for(let j=0;j<100;j++){


    let row=[];


    for(let i=0;i<100;i++){


        row.push(
            values[
                j*100+i
            ]
        );


    }


    z.push(row);


}



Plotly.newPlot(

"mineralPlot",

[{

    z:z,

    type:"heatmap",

    colorscale:"Viridis"

}],


{

title:
"PINN Mineral Prediction",

xaxis:{
title:"X position"
},

yaxis:{
title:"Y position"
}

}



);


}
