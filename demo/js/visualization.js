function visualizeMineral(output,T,t){


let mineral =
output.output_1;



let field=[];


for(let j=0;j<100;j++){

    let row=[];

    for(let i=0;i<100;i++){

        row.push(
            mineral[j*100+i]
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
title:"Fo90 fraction"
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
title:"x (cm)"
},

yaxis:{
title:"y (cm)"
}


}

);


}
