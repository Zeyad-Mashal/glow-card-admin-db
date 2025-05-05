const URL = "https://glow-card.onrender.com/api/v1/foundation/get";

const GetAllFoundations = async (setloading, setError, setAllFoundations) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-is-dashboard": "true"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllFoundations(result.foundations)
        } else {
            if (response.status == 400) {
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
export default GetAllFoundations;