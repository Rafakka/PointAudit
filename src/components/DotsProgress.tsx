
function DotsProgress({progress}:{progress:number}) {
    const totalDots = 8;
    const activeDots = Math.round((progress/100)* totalDots);

    return (
        <div className="flex gap-2">
            {Array.from({length:totalDots}).map((_,i)=>(
                <span key={i}
                className={`w-3 h-3 rounded-full transition-opacity duaration-300 ${
                    i < activeDots ? "bg-cyan-500 opacity-100":"opacity-20 bg-cyan-500"}`}
            ))}
        </div>
        );
    }