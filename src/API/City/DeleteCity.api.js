const URL = "https://glow-card.onrender.com/api/v1/city/delete/";
const token = localStorage.getItem("token");
const DeleteCity = async (setLoading, setError, id, setShowDeleteModal, getAllCities) => {
    setLoading(true)

    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowDeleteModal(false);
            getAllCities();
        } else {
            if (response.status == 403) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 404) {
                console.log(result.message);
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
export default DeleteCity;