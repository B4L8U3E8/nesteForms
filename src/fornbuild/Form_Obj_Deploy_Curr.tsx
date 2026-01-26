/* eslint-disable react-hooks/refs */
import { type CSSProperties, useRef, useState } from "react";
import "./App(FormObj).css";
import type { OBJ } from "./Form_Obj_Curr";

export const Form_Obj_Deploy_pre = ({ props }: OBJ) => {
  type tempObj = { [key: string]: tempObj | string };
  type keySet = { [key: string]: string };
  type dataArray = Array<OBJ>;

  const paraProp = JSON.parse(JSON.stringify(props));
  const [Dobject] = useState<OBJ>(paraProp);
  const [DataArr, setDataArr] = useState<dataArray>([]);
  const keyChain = useRef<keySet>({});
  const DynamicKey = useRef<number>(0);

  const HandleNewInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (e.target) {
      keyChain.current = { ...keyChain.current, [name]: value };
    }
  };

  const SearchAdd = (SVO: OBJ, KL: keySet): OBJ => {
    const updated: tempObj = {};
    Object.entries(SVO).forEach(([k, v]) => {
      if (typeof v === "object") {
        v = SearchAdd(v, KL);
      }
      updated[k] = v;
      Object.entries(KL).forEach(([ky, va]) => {
        if (ky === k) {
          updated[k] = va;
        }
      });
    });
    return updated;
  };

  const ScrubField = () => {
    DynamicKey.current = DynamicKey.current + 1;
    const inputElement = document.getElementById("INP") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
    return { key: DynamicKey };
  };

  const setValue = () => {
    if (Object.keys(keyChain.current).length !== 0) {
      const updated = SearchAdd(Dobject, keyChain.current);
      setDataArr((prev) => [...prev, updated]);
      ScrubField();
      keyChain.current = {};
    }
  };

  const InpStyle: CSSProperties = {
    display: "flex",
    width: "100px",
    height: "20px",
    backgroundColor: "rgb(234, 227, 175)",
    color: "black",
    borderStyle: "solid",
    borderColor: "rgb(6, 6, 51)",
    borderWidth: "3px",
    borderRadius: "9px",
    fontSize: "18px",
    fontStyle: "bold",
    fontFamily: "Times New Roman",
    position: "relative",
    left: "50px",
  };

  const Disp = (DO: OBJ) => {
    return Object.entries(DO).map(([key, val], i) => {
      if (typeof val === "object") {
        return (
          <div
            key={key}
            style={{
              borderBlockColor: `rgb(${i * 150}, 80, 105)`,
              marginLeft: "20px",
            }}
          >
            {Object.keys(val).length === 0 ? (
              <span style={{ display: "flex" }}>
                <div> {key}: </div>
                <input
                  key={DynamicKey.current.toString()}
                  id="INP"
                  style={InpStyle}
                  type="text"
                  name={key}
                  onChange={HandleNewInput}
                />
              </span>
            ) : (
              <div>
                {" "}
                {key} {Disp(val)}{" "}
              </div>
            )}
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

  const Output = (OP: dataArray | tempObj) => {
    if (Array.isArray(OP)) {
      return OP.map((v, k) => {
        return (
          <div key={k}>
            _____________________
            <br />
            <span style={{ color: "greenyellow", fontSize: "24px" }}>
              {" "}
              {k}:
            </span>
            {Output(v)}
          </div>
        );
      });
    }
    if (typeof OP === "object") {
      return Object.entries(OP).map(([ke, va]) => (
        <div key={ke} style={{ position: "relative", left: "20px" }}>
          <span> {ke} : </span>
          <span>
            {" "}
            {typeof va === "string" ? (
              <span style={{ fontSize: "24px" }}> {va} </span>
            ) : null}
          </span>
          {Output(va as OBJ)};
        </div>
      ));
    }
  };

  return (
    <div className="root">
      <div className="b_container">
        <div id="control_container" style={{ alignItems: "center" }}>
          <br />
          <div style={{ fontSize: "24px", color: "darkseagreen" }}>
            {" "}
            CREATE FORM
          </div>
          <br />
          <button id="btnA" onClick={setValue}>
            Inpur
          </button>
        </div>
      </div>

      <div className="b_container">
        <div className="data_container" style={{ fontSize: "18px" }}>
          <div> {JSON.stringify(Dobject)} </div>
          <br />
          Data{" "}
          {DataArr.map((v, k) => (
            <div key={k}>
              {k} : {JSON.stringify(v)}
            </div>
          ))}
          <br />
          {/* CHAIN {JSON.stringify(keyChain.current)} */}
          <br />
        </div>
      </div>

      <div className="b_container">
        <div
          className="data_container"
          style={{ fontSize: "18px", display: "flex", flexDirection: "row" }}
        >
          {Disp(Dobject)}
        </div>
      </div>

      <div className="b_container">
        <div id="data_containerA">
          OUTPUT
          {Output(DataArr)}
        </div>
      </div>
    </div>
  );
};
