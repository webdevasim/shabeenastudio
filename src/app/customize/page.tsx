"use client";
import {useEffect} from "react";import {useStore} from "../../store/useStore";import App from "../../App";export default function Customize(){const set=useStore(s=>s.setActiveScreen);useEffect(()=>set("studio"),[set]);return <App/>;}
