import React,{useState} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import store from './LinkedList'
//import "./App1.scss"
//import Effects from './Efects';
//import ImagePrev from './ImagePrev';

function ImageEditor() {
    const[state,setState]=useState({
        image:"",
        grayScale:0,
        brightness:100,
        saturate:100,
        contrast:100,
        rotate:1,
        horizintal:1,
        vertical:1

    })
    const [details ,setDetails]=useState()
    const [crop, setCrop] = useState()
    const ShowImage=(e)=>{
        if(e.target.files.length !== 0) { 
            const reader =new FileReader()
            reader.onload =()=>{
                setState({
                    ...state,
                    image:reader.result
                })

                const stateData ={
                    image:reader.result,
                    grayScale:0,
                    brightness:100,
                    saturate:100,
                    contrast:100,
                    rotate:0,
                    horizintal:1,
                    vertical:1
                }
                store.insert(stateData)
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    const effects=[
        {name:'grayScale',
        maxValue:'100%'},
        {name:'brightness',
        maxValue:'200%'},
        {name:'saturate',
        maxValue:'200%'},
        {name:'contrast',
        maxValue:'200%'},
    ]
    const [filter,setFilter]=useState({
        name:'grayScale',
        maxValue:'200%'
    })
    const handleChange=(e)=>{
        setState({
            ...state,
            [e.target.name]:e.target.value
        }

        )
    }
    const RotLeft=()=>
    {
        setState({
            ...state,
            rotate:state.rotate+90
        })
        const stateData =state
            stateData.rotate=state.rotate+90
            store.insert(stateData)
    }
    const RotRight=()=>
    {
        setState({
            ...state,
            rotate:state.rotate-90
        })
        const stateData =state
        stateData.rotate=state.rotate-90
        store.insert(stateData)
    }
    const LeftRight=()=>
    {
        setState({
            ...state,
            horizintal:state.horizintal===1?-1:1
        })
        const stateData =state
        stateData.horizintal=state.horizintal===1?-1:1
        store.insert(stateData)
    }
    const topBottom=()=>
    {
        setState({
            ...state,
            vertical:state.vertical===1?-1:1
        })
        const stateData =state
        stateData.vertical=state.vertical===1?-1:1
        store.insert(stateData)
    }
    const ImageCrop=()=>
    {
        const canava=document.createElement("canvas");
        const scaleX=details.naturalWidth/details.width;
        const scaleY=details.naturalHeight/details.height;
        canava.width=crop.width
        canava.height=crop.height
        const ctx =canava.getContext("2d")
        ctx.drawImage(
            details,
            crop.x*scaleX,
            crop.y*scaleY,
            crop.width*scaleX,
            crop.height*scaleY,
            0,
            0,
            crop.width,crop.height
        )
        const base64Url = canava.toDataURL("image.jpg")
        setState({
            ...state,
            image:base64Url
        })

    }
    const redo=()=>{
        const data = store.redo()
        if (data){
            setState(data)
        }
    }
    const undo=()=>{
        const data = store.undo()
        if (data){
            setState(data)
        }
    }
    const Save=()=>{
        const canava=document.createElement("canvas");
        //const scaleX=details.naturalWidth/details.width;
        //const scaleY=details.naturalHeight/details.height;
        canava.width=details.naturalWidth
        canava.height=details.naturalHeight
        const ctx =canava.getContext("2d")
        ctx.filter=`brightness(${state.brightness}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayScale}%)`
        ctx.transform=` scale(${state.vertical},${state.horizintal })`
        ctx.translate(canava.width/2 ,canava.height/2)
        ctx.rotate(state.rotate * Math.PI/100)
        ctx.drawImage(
            details,
            canava.width/2,
            canava.height/2,
            canava.width,
            canava.height
        )
        const link =document.createElement('a')
        link.download="image-edit.png"
        link.href=canava.toDataURL()
        link.click()
    
    }
    const Rest=()=>{
        setState({
            
                ...state,
                grayScale:0,
                brightness:100,
                saturate:100,
                contrast:100,
                rotate:0,
                horizintal:1,
                vertical:1
            
        })
        store.rest()
    }
 return (
    <>
        <div className='editor'>
            <div className='card'>
                <div className='card-head'>
                    <h1>foto Shob</h1>
                </div>

                <div className='card-body'>
                        <div className='image-sec'>
                            <div className='Img'>
                            {
                                state.image?<ReactCrop crop={crop} onChange={c => setCrop(c)}>
                                <img onLoad={(e)=>setDetails(e.currentTarget)} style={{filter:`brightness(${state.brightness}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayScale}%)`, transform:`rotate(${state.rotate}deg) scale(${state.vertical},${state.horizintal})`}} src={state.image} alt="Loading..."/></ReactCrop>:<label className='Choose' htmlFor="choose">Choose Image</label>
                            }
                            </div>
                        
                            <div className='select-img'>
                                <button onClick={undo} className='undo btn'>Undo</button>
                                <button onClick={redo} className='redo btn'>Redo</button>
                                {
                                    crop&&<button onClick={ImageCrop} className='crop btn'>Crop</button>
                                }
                                <label className='Choose btn' htmlFor="choose">Choose Image</label>
                                <input type="file" onChange={ShowImage} id="choose" hidden/>
                            </div>
                        </div>
                    {
                        details&&<div className='edit-bar'>
                            <div className='effects'>
                                        <span>Effect</span>
                                        <div className='effect-bar'>
                                            {
                                                effects.map((effect,i)=><button className={filter.name===effect.name? 'active' : ''} onClick={()=> {
                                                    setFilter(effect)
                                                    console.log(state[filter.name])
                                                    }

                                                } effect={effect.name} key={i}>{effect.name} </button>)
                                                
                                            }
                                            <div>
                                            <input   name={filter.name} onChange={handleChange}  value={state[filter.name]}  max={filter.maxValue} type="range" className='range' /><span>{Math.floor(state[filter.name]/2)}</span>
                                            </div>
                                        </div>
                                </div>
                            <div className='rotate-bar'>
                                    <label>Rotate</label>
                                    <div className='icon'>
                                        <button onClick={RotLeft} className='rot-left'>Rotate Right</button> 
                                        <button onClick={RotRight} className='rot-left'>Rotate left</button> 
                                        <button onClick={LeftRight} className='rot-left'>AV</button> 
                                        <button onClick={topBottom} className='rot-left'> {" <> "} </button> 
                                    </div>
                                </div>
                            <div className='store'>
                                    <button className='save  btn' onClick={Save}>Save</button>
                                    <button className='rest btn' onClick={Rest}>Rest</button>

                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    </>
 )
}

export default ImageEditor;