const URL = "https://glow-card.onrender.com/api/v1/region/get/";

const GetRegion = async (setloading, setError, setAllRegions, id) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-is-dashboard": "true"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setAllRegions(result.regions)
        } else {
            if (response.status == 404) {
                setError(result.message)
                setloading(false);
                setAllRegions([])
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
export default GetRegion;