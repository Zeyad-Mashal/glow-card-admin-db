const URL = "https://glow-card.onrender.com/api/v1/city/update/";
const token = localStorage.getItem('token');
const UpdateCity = async (setLoading, setError, id, setShowUpdateModal, data, getAllCities, clearData) => {
    setLoading(true)
    console.log(id);
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'PUT',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowUpdateModal(false);
            getAllCities();
            clearData()
        } else {
            if (response.status == 404) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setLoading(false);
            }
            setLoading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default UpdateCity;