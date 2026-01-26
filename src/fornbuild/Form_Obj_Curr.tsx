import { type CSSProperties, useCallback, useEffect, useState } from "react"
import './App(FormObj).css'

import React from "react";
import { useRef } from "react"

// const Handle = React.memo(({ value, name, onChange }: 
// { value: string; name:string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => 

// {
//                 return <    input   id='inp_1'
//                                     type="text" 
                                
//                                     value={value} 
//                                     onChange={onChange} />;
// });

 let j=0;
export type OBJ = { [key:string] : string | OBJ}

export const Form_Build_obj_Curr =()=>{


    type tempObj = {[key:string]: any}
   
   

    const [object, setObject] = useState<OBJ>({})
  

    const [dynatmicKey, setDynamicKey]=useState("")
    
    const currKey = useRef<string>("")

    const StoredKeySet = useRef<string[]>([])

    const PrimObjName=useRef<HTMLInputElement>(null)
    const HandleFormName = (e:React.ChangeEvent<HTMLInputElement>)=>{

        if (PrimObjName.current) 
            {PrimObjName.current.value= e.target.value}

        };

    const Initial_Object=(PO:OBJ)=>{

                if(Object.keys(PO).length === 0)
                    {setObject({[PrimObjName.current?.value!]:{}})}  

                StoredKeySet.current.push(PrimObjName.current!.value) 
    
        };



    const HandlecurrKey = (e:React.ChangeEvent<HTMLInputElement>)=>{
    
                currKey.current = e.target.value

        };

   

    const InsertObjects=(IO:OBJ, sKey:string):tempObj=>{

            const updatedObj:OBJ = {}
            Object.entries(IO).map(([k,v])=>{

                {   if (typeof v === 'object')

                    {   setDynamicKey(k)
                        updatedObj[k] = v
                        InsertObjects(v, sKey)     
                    };

                    if (k === sKey)

                    {   Object.assign(v , {[currKey.current]:{}} )  
                    
                    }; 
                };
            });
            
            return updatedObj

        };

    const FindDup =(K:string):boolean=>{
            if (StoredKeySet.current.includes(K))
            {   alert("Duplicate FOUND")
  
                return true}

            else   { StoredKeySet.current.push(currKey.current)
            
            return false}
            
            
    }

    const UpdatedObj =(UO:OBJ, sKey:string)=>{
            
        if (!FindDup(currKey.current))

            {  setObject(InsertObjects(UO, sKey));
                   
             }
        
   
    }

    const SplitObj =(SO:OBJ, sKey:string)=>{
    
        Object.entries(SO).map(([k, v])=>{
            if (typeof v === 'object') 
                {   SplitObj(v, sKey) }
                        
                if (k === sKey)
                {setObject(prev=>({...prev, [k]:{}, ...prev}))}
            
        })}

        const DeleteObj = (DO:OBJ, sKey:string):OBJ=>{
        
            let updated:OBJ={}
            Object.entries(DO).forEach(([k, v])=>{

            if (typeof v === 'object')    
                { v = DeleteObj(v as OBJ, sKey)}
                updated[k]=v
        
                if (k === sKey)
                 {
            
                delete updated[k]


            } 

        })

        return updated
        }

    const DeleteObject =(sKey:string)=>{

        setObject(DeleteObj(object, sKey))
    }

    const [post, setPost]= useState("");
    const [ExpObj, setExpObj] = useState({})


    const PostObj =()=>{
        
        setPost("P");
        setExpObj(object);
    }


    const InpStyle:CSSProperties= {display: 'flex',width: '100px', height: '20px', 
                                    backgroundColor: 'rgb(234, 227, 175)',color:'black', 
                                    borderStyle: 'solid', borderColor: 'rgb(6, 6, 51)',
                                    borderWidth: '3px', borderRadius: '9px',
                                    fontSize: '18px', fontStyle: 'bold',fontFamily: 'Times New Roman'
                                    ,position:'relative', left:'50px'}
        

    const Disp=(DO:OBJ)=>{
    
        return( Object.entries(DO).map(([key, val],i)=>{

            if (typeof val === 'object')

                {   return(     
                                <div key={key} id='data_containerA' 
                                    >
                                    
                                    <span style={{  display:"flex"}}> 
                                    {key}:      
                                            <input  style={{ position:'relative', left:'50px' }}

                                                    id='inp_2'
                                                    type='text'
                                                    name={key}
                                                    onChange={HandlecurrKey}                                         
                                            />
                                        
                                        <button style={{marginLeft:'80px', marginBottom:'15px'}} 
                                                id='btnC' 
                                                // onClick={()=>UpdatedObj(object, key)}
                                                onClick={()=>(UpdatedObj(object, key))}
                                                >         
                                                ADD 
                                            </button>   

                                            <button style={{marginLeft:'10px', marginBottom:'15px'}} 
                                                id='btnC' onClick={()=>DeleteObject(key)}>         
                                                DEL 
                                            </button>  

                                        {/* <button style={{marginLeft:'10px', marginBottom:'15px'}} 
                                                id='btnC' onClick={()=>SplitObj(object, key)}>         
                                                Split 
                                        </button>  */}

                                    </span>
                                            {Disp(val)}  
                                
                                </div>
                            )
                }

                else{ 
                        return  (
                                    <span key={key}> 
                                    <span> {key} : {val} </span>
                                    </span>                       
                                )
                    }               
                })
            )
        } ; 



j=j+1
console.log("Render Counter:" + j)
return(

    <div className='r' style={{display:'flex', flexDirection:'column'}}>

        {post === 'P' ? <Form_Obj_Deploy_pre props={((object))}/> :

    <div className="root">
     
   
        <div className="b_container">
            <div id='control_container' style={{alignItems:'center'}}>
                    <br/>
                    <input  id='inp_1'
                            type='text'
                            ref={PrimObjName}
                            onChange={HandleFormName}
                    />
                    <br/>
                    <div> {dynatmicKey} </div>
                    <br/>
                    <button id='btnA' onClick={()=> Initial_Object(object)}> Create </button>
                    <br/>

                    <button id='btnA' onClick={PostObj}> POST </button>
            </div>  
        </div>

        <div className="b_container">
            <div className="data_container" style={{fontSize:'18px'}}>
                {JSON.stringify(object)}
                <br/>
                 Stored Key Set: {JSON.stringify(StoredKeySet)}
                <br/>
            
               
            </div>
        </div>

        <div className="b_container">
            <div className="data_container" style={{fontSize:'18px',  display:'flex', flexDirection:'row'}}>
                {Disp(object)}


            </div>
        </div> 

    </div>}
       
    </div> 
    
 
)

}
// type C = [number, number]
// let x:number
// let y:number
// x=9;
// y=6;
// const CO:C = [x,y]
// const T = {A:CO}
// type Ti = {T: {[string:string]:string}}
// const PR:Ti = {T:{"A":"d"}}
// console.log(PR)
// console.log(T)
// console.log(T.A)
// console.log(T.A[0], " : " ,T.A[1])


// const A = {"A":{"B":{"C":{}}}}

// console.log(Object.keys(A.A.B))

const T = {"A":{"a":{},"b":{"b.2":{"b.2.1":{},"b.2.2":{}},"b.3":{}}}}

// Object.entries(T).forEach(([k,v])=>{
//     console.log(k, " " , v)
// })


// Object.entries(T).forEach(([k,v])=>{
//     console.log(k, " " , v)
// })
import type { ChangeEvent } from "react";
import { Form_Obj_Deploy_pre } from "./Form_Obj_Deploy_Curr";


    interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(({ value, onChange }) => {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <input id='inp_1' type="text" value={value} onChange={handleChange} />
  );
});

const App: React.FC = () => {
    j=j+1;
    console.log(j)
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div>
      <h1>Input Field Example</h1>
      <InputField  value={inputValue} onChange={handleInputChange} />
    </div>
  );
};
