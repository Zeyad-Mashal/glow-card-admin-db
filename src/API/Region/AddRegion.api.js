const URL = "https://glow-card.onrender.com/api/v1/region/add/";
const token = localStorage.getItem('token');
const AddRegion = async (setloading, setError, data, setShowModal, clearData, id, getAllRegions) => {
    setloading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setShowModal(false);
            clearData();
            getAllRegions()
        } else {
            if (response.status == 500) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 404) {
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
export default AddRegion;