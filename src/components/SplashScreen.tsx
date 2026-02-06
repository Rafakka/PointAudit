

function SplashScreen({progress} : {progress:number}){
    return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
            {/*Logo*/}
            <img src="/logo.png" className="w-40 mb-6 animate fade-in" alt="Point Audit"/>

            {/*Title*/}
            <h1 className="text-3xl font-bold text-red-600 mb-2 anime-fade-in-delay"> POINT AUDIT</h1>

            {/*Loading text*/}
            <p className="text-gray-500 mb-4 animate-fade-in-delay-2">carregando</p>

            {/*Dots*/}
            <DotsProgress progress={progress}/>
        </div>
        );
    }
