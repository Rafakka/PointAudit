
type SplashScreenProps = {
    progress:number;
};

export default function SplashScreen({progress}:SplashScreenProps) {
    const totalDots = 8
    const activeDots = Math.round((progress/100)*totalDots)

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
            {/*logo*/}
            <img
            src="/logo.png"
            alt="Point audit"
            className="w-40 mb-6 animate-fade-in"
            />
            {/*title*/}
            <h1 className="text-3xl font-bold text-red-600 mb-2 animate-fade-in-delay">
                POINT AUDIT
            </h1>
            {/*loading text*/}
            <div className="flex gap-2">
                {Array.from({length:totalDots}).map((__,i)=>(
                    <span
                    key={i}
                    className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
                        i < activeDots
                        ? "bg-cyan-100" :"bg-cyan-20"
                    }`}
                    />
                ))}
            </div>
        </div>
    );
}
