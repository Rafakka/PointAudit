
function LoadingDots(){
   return (
    <div className="loading-dots-container">
        <div className="loading-dot"/>
        <div className="loading-dot"/>
        <div className="loading-dot"/>
        </div>
   );
}


export default function SplashScreen({progress}:
    {progress:number}
) {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
            <img
            src="/logo.png"
            alt="Point Audit"
            className="w-40 mb-6 block mx-auto"
            />
            <h1 className="text-3xl font-bold text-red-600, mb-2">
                Bem-vindo
            </h1>
            <p className="text-gray-500 mb-4">
                Carregando            
            </p>
            <LoadingDots/>
        </div>
    );
}
