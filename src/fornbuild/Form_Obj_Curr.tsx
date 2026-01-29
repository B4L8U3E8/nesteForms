/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App(FormObj).css";

import React from "react";
import { useRef } from "react";
import { Form_Obj_Deploy_pre } from "./Form_Obj_Deploy_Curr";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";



// const Handle = React.memo(({ value, name, onChange }:
// { value: string; name:string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) =>

// {
//                 return <    input   id='inp_1'
//                                     type="text"

//                                     value={value}
//                                     onChange={onChange} />;
// });

export type OBJ = { [key: string]: string | OBJ };

export const Form_Build_obj_Curr = () => {
  type tempObj = { [key: string]: { [key: string]: OBJ } };

  const [object, setObject] = useState<OBJ>({});

  const [dynatmicKey, setDynamicKey] = useState("");

  const currKey = useRef<string>("");

  const StoredKeySet = useRef<string[]>([]);

  const PrimObjName = useRef<HTMLInputElement>(null);
  const HandleFormName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (PrimObjName.current) {
      PrimObjName.current.value = e.target.value;
    }
  };

  const Initial_Object = (PO: OBJ) => {
    if (Object.keys(PO).length === 0) {
      setObject({ [PrimObjName?.current?.value as string]: {} });
    }

    StoredKeySet.current.push(PrimObjName.current!.value);
  };

  const HandlecurrKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    currKey.current = e.target.value;
  };

  const InsertObjects = (IO: OBJ, sKey: string): tempObj => {
    const updatedObj: OBJ = {};
    Object.entries(IO).map(([k, v]) => {
      {
        if (typeof v === "object") {
          setDynamicKey(k);
          updatedObj[k] = v;
          InsertObjects(v, sKey);
        }

        if (k === sKey) {
          Object.assign(v, { [currKey.current]: {} });
        }
      }
    });

    return updatedObj as tempObj;
  };

  const FindDup = (K: string): boolean => {
    if (StoredKeySet.current.includes(K)) {
      alert("Duplicate FOUND");

      return true;
    } else {
      StoredKeySet.current.push(currKey.current);

      return false;
    }
  };

  const UpdatedObj = (UO: OBJ, sKey: string) => {
    if (!FindDup(currKey.current)) {
      setObject(InsertObjects(UO, sKey));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const SplitObj = (SO: OBJ, sKey: string) => {
    Object.entries(SO).map(([k, v]) => {
      if (typeof v === "object") {
        SplitObj(v, sKey);
      }

      if (k === sKey) {
        setObject((prev) => ({ ...prev, [k]: {}, ...prev }));
      }
    });
  };

  const DeleteObj = (DO: OBJ, sKey: string): OBJ => {
    const updated: OBJ = {};
    Object.entries(DO).forEach(([k, v]) => {
      if (typeof v === "object") {
        v = DeleteObj(v as OBJ, sKey);
      }
      updated[k] = v;

      if (k === sKey) {
        delete updated[k];
      }
    });

    return updated;
  };

  const DeleteObject = (sKey: string) => {
    setObject(DeleteObj(object, sKey));
  };

  const [post, setPost] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setExpObj] = useState({});

  const PostObj = () => {
    setPost("P");
    setExpObj(object);
  };

  const Disp = (DO: OBJ) => {
    return Object.entries(DO).map(([key, val]) => {
      if (typeof val === "object") {
        return (
          <div key={key} id="data_containerA" className=" flex flex-col gap-2">
              {key}:
              <input
                style={{ position: "relative", left: "50px" }}
                id="inp_2"
                type="text"
                name={key}
                onChange={HandlecurrKey}
              />

              <Button onClick={() => UpdatedObj(object, key)} 
                className="w-24 h-6 bg-green rounded-xl">    ADD</Button>
         
             
          
              <button
                style={{ marginLeft: "10px", marginBottom: "15px" }}
                id="btnC"
                onClick={() => DeleteObject(key)}
              >
                DEL
              </button>
      
            {Disp(val)}
          </div>
        );
      } else {
        return (
          <span key={key}>
            <span>
              {" "}
              {key} : {val}{" "}
            </span>
          </span>
        );
      }
    });
  };


  return (
    <div className="flex flex-col gap-4">
      {post === "P" ? (
        <Form_Obj_Deploy_pre props={object} />
      ) : (
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row gap-2 items-start">
            <div  className="flex flex-col gap-2 items-start">
              <br />
              <Input
              className="ml-p2 indent-2"
        
                type="text"
                ref={PrimObjName}
                onChange={HandleFormName}
              />
              <br />
              <div> {dynatmicKey} </div>
              <br />
              
              <Button onClick={() => Initial_Object(object)} className="p-2">
                {" "}
                Create{" "}
              </Button>
              <br />

              <button id="btnA" onClick={PostObj}>
                {" "}
                POST{" "}
              </button>
            </div>
          <div className="b_container">
            <div
              className="data_container"
              style={{
                fontSize: "18px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {Disp(object)}
            </div>
          </div>

        </div>
          </div>

      

      )}
          <div className="b_container">
            <div className="data_container" style={{ fontSize: "18px" }}>
              {JSON.stringify(object)}
              <br />
              Stored Key Set: {JSON.stringify(StoredKeySet)}
              <br />
            </div>
          </div>
    </div>
  );
};
