

function App(){
    const [progress,setProgress] = useState(0);
    const [ready,setReady] = useState(false);

    useEffect(()=>{
        async function boot() {
            setProgress(20);
            await loadConfig();
            
            setProgress(50);
            await loadUserData();

            setProgress(80);
            await loadRules();

            setProgress(100);
            setTimeout(()=>setReady(true),300);
        }

        boot();
    },[]);
    if(!ready) {
        return <SplashScreen progress = {progress}/>;
    }
    return <MainApp/>;
}