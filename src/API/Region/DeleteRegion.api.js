const URL = "https://glow-card.onrender.com/api/v1/region/delete/";
const token = localStorage.getItem("token");
const DeleteRegion = async (setLoading, setError, regionId, setShowDeleteModal, getAllRegions) => {
    setLoading(true)

    try {
        const response = await fetch(`${URL}${regionId}`, {
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
            getAllRegions();
        } else {
            if (response.status == 500) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 404) {
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
export default DeleteRegion;