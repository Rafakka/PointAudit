
export async function clearInput(){
    const res = await fetch("http://localhost:8000/input",{
        method:"DELETE"
    })

    if (!res.ok){
        throw new Error("Delete failed")
    }

    return res.json();
}