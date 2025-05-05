const URL = "https://glow-card.onrender.com/api/v1/foundation/addToRegion";
const token = localStorage.getItem('token');
const AddLinkRegion = async (setloading, setError, regionId, foundationId, getAllFoundations, setLinkRegionModal) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}?regionId=${regionId}&foundationId=${foundationId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            getAllFoundations()
            setLinkRegionModal(false)
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
export default AddLinkRegion;