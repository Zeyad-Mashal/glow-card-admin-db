const URL = "https://glow-card.onrender.com/api/v1/statistics/get";
const token = localStorage.getItem("token");
const GetAllStat = async (setloading, setError, setAllData, data, month) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}?data=${data}&month=${month}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllData(result)
        } else {
            if (response.status == 404) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default GetAllStat;