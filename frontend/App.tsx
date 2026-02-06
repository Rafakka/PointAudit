
import { useEffect, useState } from "react";
import SplashScreen from "./src/components/SplashScreen";

export default function App(){
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(()=>{
        const steps = [20,40,60,80,100];
        let i = 0

        const interval = setInterval(()=>{
            setProgress(steps[i]);
            i++;

            if (i===steps.length){
                clearInterval(interval)
                setTimeout(()=>setReady(true),300)
            }
        }, 400);

        return()=> clearInterval(interval);
    },[]);

    if(!ready) {
        return <SplashScreen progress={progress} />;
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Main App Loaded</h1>
        </div>
    );
}