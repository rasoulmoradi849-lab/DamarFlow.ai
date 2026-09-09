let pinn_session = null;


async function loadPINN(){

    pinn_session =
    await ort.InferenceSession.create(
        "demo/model/serpentinization_pinn.onnx"
    );

    console.log(
        "Serpentinization PINN loaded"
    );

}



async function runPINN(T,t){


    let nx = 100;
    let ny = 100;


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


    let tensor =
    new ort.Tensor(
        "float32",
        Float32Array.from(input),
        [nx*ny,4]
    );


    let output =
    await pinn_session.run(
        {
            xytT:tensor
        }
    );


    return output;

}
